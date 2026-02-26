import { describe, expect, it } from 'vitest'
import { createAreaState, parseArea, serializeArea } from '../../src/store/area.js'
import {
  createGridState,
  isValidTrackSize,
  parseGridTemplate,
  valueUnitToString,
  withChangedUnit,
} from '../../src/store/grid.ts'

function createSerializableArea() {
  return createAreaState({
    name: 'container',
    display: 'grid',
    grid: createGridState({
      row: {
        sizes: ['80px', '1fr'],
        auto: ['20px'],
        lineNames: [
          { active: true, name: 'top' },
          { active: false, name: '' },
          { active: true, name: 'bottom' },
        ],
        gap: '4px',
      },
      col: {
        sizes: ['1fr'],
        auto: ['10px'],
        lineNames: [
          { active: true, name: 'left' },
          { active: true, name: 'right' },
        ],
        gap: '8px',
      },
    }),
  })
}

describe('area parse/serialize behavior', () => {
  it('round-trips grid templates, line names, and auto tracks', () => {
    const serialized = serializeArea(createSerializableArea())
    const parsed = parseArea(serialized)

    expect(parsed.grid.row.sizes).toEqual(['80px', '1fr'])
    expect(parsed.grid.col.sizes).toEqual(['1fr'])
    expect(parsed.grid.row.lineNames.map((line) => line.name)).toEqual(['top', '', 'bottom'])
    expect(parsed.grid.col.lineNames.map((line) => line.name)).toEqual(['left', 'right'])
    expect(parsed.grid.row.auto).toEqual(['20px'])
    expect(parsed.grid.col.auto).toEqual(['10px'])
  })

  it('falls back to empty templates when saved design has no explicit tracks', () => {
    const parsed = parseArea(
      JSON.stringify({
        version: 2,
        area: {
          name: 'container',
          display: 'grid',
          grid: { gap: '0px 0px' },
        },
      })
    )

    expect(parsed.grid.row.sizes).toEqual([])
    expect(parsed.grid.col.sizes).toEqual([])
    expect(parsed.grid.row.lineNames).toEqual([{ active: false, name: '' }])
    expect(parsed.grid.col.lineNames).toEqual([{ active: false, name: '' }])
  })

  it('loads legacy v1 layouts where children are stored in grid.areas', () => {
    const parsed = parseArea(
      JSON.stringify({
        name: 'legacy-root',
        grid: {
          gap: '0px 0px',
          templateColumns: '1fr',
          templateRows: '1fr',
          areas: [{ name: 'legacy-child', gridArea: '1 / 1 / 2 / 2' }],
        },
      })
    )

    expect(parsed.children).toHaveLength(1)
    expect(parsed.children[0].name).toBe('legacy-child')
    expect(parsed.children[0].parent).toBe(parsed)
  })
})

describe('grid parsing and track-size validation', () => {
  it('parses named grid templates in positional order', () => {
    const [tracks, lines] = parseGridTemplate('[start] minmax(10px,1fr) [middle] 2fr [end]')

    expect(tracks).toEqual(['minmax(10px,1fr)', '2fr'])
    expect(lines).toEqual(['start', 'middle', 'end'])
  })

  it('accepts valid track sizes and rejects invalid values', () => {
    expect(Boolean(isValidTrackSize('1fr'))).toBe(true)
    expect(Boolean(isValidTrackSize('minmax(10px, 2fr)'))).toBe(true)
    expect(Boolean(isValidTrackSize('12qu'))).toBe(false)
    expect(Boolean(isValidTrackSize('abc'))).toBe(false)
  })

  it('serializes unit changes consistently', () => {
    expect(valueUnitToString({ value: '10', unit: 'px' })).toBe('10px')
    expect(withChangedUnit('25px', 'fr')).toBe('1fr')
  })
})
