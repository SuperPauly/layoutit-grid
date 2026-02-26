import { beforeEach, describe, expect, it } from 'vitest'
import {
  addCol,
  addRow,
  currentArea,
  mainArea,
  newAreaName,
  removeArea,
  removeCol,
  removeRow,
  restart,
  selection,
  selectionGridArea,
  setMainArea,
} from '../../src/store.js'
import { createAreaState, parentify } from '../../src/store/area.js'
import { createGridState } from '../../src/store/grid.ts'

function createGridAreaWithChildren(children = []) {
  const root = createAreaState({
    name: 'root',
    display: 'grid',
    grid: createGridState(),
    children,
  })
  return parentify(root)
}

describe('store grid mutators', () => {
  beforeEach(() => {
    selection.value = null
    restart()
  })

  it('adds rows and cols with new line names and clears active selection', () => {
    const grid = createGridState()
    selection.value = { active: true }

    addRow(grid, '20px')
    addCol(grid, '2fr')

    expect(grid.row.sizes.at(-1)).toBe('20px')
    expect(grid.col.sizes.at(-1)).toBe('2fr')
    expect(grid.row.lineNames.at(-1)).toEqual({ active: false, name: '' })
    expect(grid.col.lineNames.at(-1)).toEqual({ active: false, name: '' })
    expect(selection.value).toBe(null)
  })

  it('removes child areas when removing a track collapses their span', () => {
    const child = createAreaState({ name: 'a1', gridArea: '2 / 1 / 3 / 2' })
    const area = createGridAreaWithChildren([child])

    removeRow(area, 1)

    expect(area.children).toHaveLength(0)
    expect(area.grid.row.sizes).toHaveLength(2)
    expect(area.grid.row.lineNames).toHaveLength(3)
  })

  it('recalculates following child coordinates when a leading track is removed', () => {
    const child = createAreaState({ name: 'a2', gridArea: '3 / 2 / 4 / 4' })
    const area = createGridAreaWithChildren([child])

    removeRow(area, 0)
    removeCol(area, 0)

    expect(area.children[0].gridArea).toBe('2 / 1 / 3 / 3')
  })
})

describe('store selection and area lifecycle', () => {
  beforeEach(() => {
    selection.value = null
    restart()
  })

  it('converts drag selection into a valid explicit grid area', () => {
    const gridArea = selectionGridArea({
      start: { row: { start: 2, end: 3 }, col: { start: 3, end: 4 } },
      end: { row: { start: 1, end: 2 }, col: { start: 1, end: 2 } },
      implicitGrid: { rd: 0, cd: 0 },
    })

    expect(gridArea).toBe('1 / 1 / 3 / 4')
  })

  it('removes an area and moves currentArea back to its parent', () => {
    const child = createAreaState({ name: 'child', gridArea: '1 / 1 / 2 / 2' })
    const root = createGridAreaWithChildren([child])
    setMainArea(root)
    currentArea.value = child

    removeArea(child)

    expect(root.children).toHaveLength(0)
    expect(currentArea.value.id).toBe(root.id)
  })

  it('creates unique area names across nested children', () => {
    const duplicatedNameChild = createAreaState({ name: 'a1' })
    const root = createGridAreaWithChildren([duplicatedNameChild])
    setMainArea(root)

    const name = newAreaName()

    expect(name).toBe('a2')
  })

  it('restart restores the default main area state', () => {
    const customMain = createAreaState({
      name: 'custom',
      display: 'grid',
      grid: createGridState({ row: { ...createGridState().row, sizes: ['100px'] } }),
    })
    setMainArea(customMain)

    restart()

    expect(mainArea.value.name).toBe('container')
    expect(mainArea.value.display).toBe('grid')
    expect(mainArea.value.grid.row.sizes).toEqual(['1fr', '1fr', '1fr'])
  })
})
