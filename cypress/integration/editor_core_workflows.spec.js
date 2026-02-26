/// <reference types="cypress" />

describe('Layoutit! Editor core workflows', () => {
  describe('desktop context workflows', () => {
    beforeEach(() => {
      cy.viewport(1280, 800)
      cy.openApp()
    })

    it('keeps mobile controls drawer closed in desktop viewport', () => {
      cy.get('[data-testid="controls-sidebar"]').should('be.visible').and('not.have.class', 'active')
      cy.get('[data-testid="workspace"]').should('be.visible')
    })

    it('adds and removes rows and columns from grid controls', () => {
      cy.get('[data-testid^="column-track-"]').its('length').as('initialColumns')
      cy.get('[data-testid^="row-track-"]').its('length').as('initialRows')

      cy.get('[data-testid="add-column"]').click()
      cy.get('[data-testid="add-row"]').click()

      cy.get('@initialColumns').then((initialColumns) => {
        cy.get('[data-testid^="column-track-"]').should('have.length', Number(initialColumns) + 1)
        cy.get(`[data-testid="remove-column-${Number(initialColumns) + 1}"]`).click()
        cy.get('[data-testid^="column-track-"]').should('have.length', Number(initialColumns))
      })

      cy.get('@initialRows').then((initialRows) => {
        cy.get('[data-testid^="row-track-"]').should('have.length', Number(initialRows) + 1)
        cy.get(`[data-testid="remove-row-${Number(initialRows) + 1}"]`).click()
        cy.get('[data-testid^="row-track-"]').should('have.length', Number(initialRows))
      })
    })

    it('changes track units and reflects changes in controls and grid styles', () => {
      cy.get('[data-testid="column-unit-1"]').select('%').should('have.value', '%')
      cy.get('[data-testid="column-size-1"]').clear().type('40').should('have.value', '40')

      cy.get('[data-testid="column-unit-1"]').select('auto').should('have.value', 'auto')
      cy.get('[data-testid="column-size-1"]').should('not.be.visible')

      cy.get('[data-testid="row-unit-1"]').select('px').should('have.value', 'px')
      cy.get('[data-testid="row-size-1"]').clear().type('120').should('have.value', '120')

      cy.get('[data-testid="row-unit-1"]').select('fr').should('have.value', 'fr')
      cy.get('[data-testid="row-size-1"]').clear().type('2').should('have.value', '2')
    })

    it('edits row and column gaps and updates styles', () => {
      cy.get('[data-testid="row-gap-unit"]').select('px')
      cy.get('[data-testid="row-gap-value"]').clear().type('18')

      cy.get('[data-testid="col-gap-unit"]').select('px')
      cy.get('[data-testid="col-gap-value"]').clear().type('26')

      cy.get('.area-editor').first().should('have.css', 'row-gap').and('eq', '18px')
      cy.get('.area-editor').first().should('have.css', 'column-gap').and('eq', '26px')
    })

    it('creates a child area, converts it to nested subgrid, and edits nested properties', () => {
      cy.get('.grid-cell[data-col-start="1"][data-row-start="1"]').first().trigger('pointerdown', {
        button: 0,
        pointerType: 'mouse',
        force: true,
      })

      cy.get('[data-testid="area-selection-name"]').should('be.visible').type('nested area')
      cy.get('[data-testid="area-selection-save"]').click()

      cy.contains('[data-testid^="area-accordion-item-"]', 'nested area').click()
      cy.get('[data-testid="area-add-subgrid-nested-area"]').click({ force: true })

      cy.get('[data-testid="add-column"]').click()
      cy.get('[data-testid="column-unit-1"]').select('px')
      cy.get('[data-testid="column-size-1"]').clear().type('80')

      cy.get('.area-editor[data-area-name="nested-area"]').should('have.css', 'display', 'grid')
      cy.get('.area-editor[data-area-name="nested-area"]').should('have.css', 'grid-template-columns').and('include', '80px')
    })

    it('selects and deletes a grid item from the editor', () => {
      cy.get('.grid-cell[data-col-start="2"][data-row-start="1"]').first().trigger('pointerdown', {
        button: 0,
        pointerType: 'mouse',
        force: true,
      })

      cy.get('[data-testid="area-selection-name"]').type('delete-me')
      cy.get('[data-testid="area-selection-save"]').click()

      cy.get('[data-testid="area-accordion-item-delete-me"]').click()
      cy.get('.area-editor[data-area-name="delete-me"]').should('exist')

      cy.get('body').type('{del}')

      cy.get('[data-testid="area-accordion-item-delete-me"]').should('not.exist')
      cy.get('.area-editor[data-area-name="delete-me"]').should('not.exist')
    })
  })

  describe('mobile context workflows', () => {
    beforeEach(() => {
      cy.viewport(390, 844)
      cy.openApp()
    })

    it('keeps workspace visible while toggling controls and supports nested-grid touch workflows', () => {
      cy.get('[data-testid="workspace"]').as('workspace').should('be.visible')
      cy.get('@workspace').should('have.css', 'display').and('not.eq', 'none')
      cy.get('[data-testid="controls-sidebar"]').should('not.have.class', 'active')

      cy.get('[data-testid="mobile-controls-toggle"]').click()
      cy.get('[data-testid="controls-sidebar"]').should('have.class', 'active').and('be.visible')
      cy.get('@workspace').should('be.visible')
      cy.get('@workspace').should('have.css', 'display').and('not.eq', 'none')

      cy.get('[data-testid="mobile-controls-toggle"]').click()
      cy.get('[data-testid="controls-sidebar"]').should('not.have.class', 'active')
      cy.get('@workspace').should('be.visible')
      cy.get('@workspace').should('have.css', 'display').and('not.eq', 'none')

      cy.get('.grid-cell[data-col-start="1"][data-row-start="1"]').first().click({ force: true })

      cy.get('[data-testid="area-selection-name"]').should('be.visible').type('mobile nested')
      cy.get('[data-testid="area-selection-save"]').click()

      cy.get('[data-testid="area-accordion-item-mobile-nested"]').click()
      cy.get('[data-testid="area-add-subgrid-mobile-nested"]').click({ force: true })

      cy.get('[data-testid="add-column"]').click()
      cy.get('[data-testid="column-unit-1"]').select('%')
      cy.get('[data-testid="column-size-1"]').clear().type('60')

      cy.get('.area-editor[data-area-name="mobile-nested"]').as('mobileNestedArea').should('exist')
      cy.get('@mobileNestedArea').should('have.css', 'display', 'grid')
      cy.get('@mobileNestedArea').should('have.css', 'grid-template-columns').and('include', '60%')

      cy.get('[data-testid="area-accordion-item-mobile-nested"]').click()
      cy.get('body').type('{del}')

      cy.get('[data-testid="area-accordion-item-mobile-nested"]').should('not.exist')
      cy.get('.area-editor[data-area-name="mobile-nested"]').should('not.exist')
    })
  })
})
