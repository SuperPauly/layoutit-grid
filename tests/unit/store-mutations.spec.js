import { beforeEach, describe, expect, test, vi } from 'vitest'

async function freshStore() {
  vi.resetModules()
  localStorage.clear()
  return await import('../../src/store.js')
}

describe('store mutation invariants', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('addRow/addCol append track sizes and line names while clearing selection', async () => {
    const store = await freshStore()
    const area = store.mainArea.value
    const grid = area.grid

    store.selection.value = { area }
    const rowSizesBefore = grid.row.sizes.length
    const rowLinesBefore = grid.row.lineNames.length
    const colSizesBefore = grid.col.sizes.length
    const colLinesBefore = grid.col.lineNames.length

    store.addRow(grid, '120px')
    store.addCol(grid, '2fr')

    expect(store.selection.value).toBeNull()
    expect(grid.row.sizes).toHaveLength(rowSizesBefore + 1)
    expect(grid.row.lineNames).toHaveLength(rowLinesBefore + 1)
    expect(grid.col.sizes).toHaveLength(colSizesBefore + 1)
    expect(grid.col.lineNames).toHaveLength(colLinesBefore + 1)
    expect(grid.row.sizes.at(-1)).toBe('120px')
    expect(grid.col.sizes.at(-1)).toBe('2fr')
  })

  test('removeRow updates child placements and collapses fully removed child areas', async () => {
    const store = await freshStore()
    const area = store.mainArea.value

    const movedChild = store.createAreaState({
      name: 'moved',
      parent: area,
      gridArea: '2 / 1 / 3 / 2',
    })
    const collapsedChild = store.createAreaState({
      name: 'collapsed',
      parent: area,
      gridArea: '1 / 1 / 2 / 2',
    })

    area.children.push(movedChild, collapsedChild)

    store.removeRow(area, 0)

    expect(area.grid.row.sizes).toHaveLength(2)
    expect(area.grid.row.lineNames).toHaveLength(3)
    expect(area.children.map((child) => child.name)).toEqual(['moved'])
    expect(area.children[0].gridArea).toBe('1 / 1 / 2 / 2')
  })

  test('removeCol updates child placements and removes collapsed areas', async () => {
    const store = await freshStore()
    const area = store.mainArea.value

    const shiftedChild = store.createAreaState({
      name: 'shifted',
      parent: area,
      gridArea: '1 / 2 / 2 / 3',
    })
    const collapsedChild = store.createAreaState({
      name: 'collapsedCol',
      parent: area,
      gridArea: '1 / 1 / 2 / 2',
    })

    area.children.push(shiftedChild, collapsedChild)

    store.removeCol(area, 0)

    expect(area.grid.col.sizes).toHaveLength(2)
    expect(area.grid.col.lineNames).toHaveLength(3)
    expect(area.children.map((child) => child.name)).toEqual(['shifted'])
    expect(area.children[0].gridArea).toBe('1 / 1 / 2 / 2')
  })

  test('addImplicitArea appends child with parent relationship and keeps area auto-placed', async () => {
    const store = await freshStore()
    const area = store.mainArea.value

    store.selection.value = { area }
    store.addImplicitArea(area)

    const child = area.children.at(-1)
    expect(store.selection.value).toBeNull()
    expect(child).toBeTruthy()
    expect(child.parent).toBe(area)
    expect(child.gridArea).toBe('auto')
    expect(child.name.startsWith('i')).toBe(true)
  })

  test('selection/current-area invariants clear stale selection when changing current area', async () => {
    const store = await freshStore()
    const root = store.mainArea.value
    const selectedArea = store.createAreaState({ name: 'selected', parent: root })
    root.children.push(selectedArea)

    store.selection.value = { area: selectedArea }
    store.setCurrentArea(root)
    expect(store.selection.value).toBeNull()

    store.selection.value = { area: root }
    store.setCurrentArea(root)
    expect(store.selection.value).toEqual({ area: root })
  })
})
