/// <reference types="cypress" />

describe('Layoutit! Basic Page Render', () => {
  beforeEach(() => {
    cy.openApp()
  })

  describe('Workspace', () => {
    it('grid workspace container should be visible', () => {
      cy.get('[data-testid=workspace]').should('be.visible')
    })
    it('area editor should be rendered inside the workspace', () => {
      cy.get('[data-testid=workspace] .area-editor').should('exist')
    })
  })

  describe('Controls sidebar', () => {
    it('controls sidebar should be rendered', () => {
      cy.get('[data-testid=controls-sidebar]').should('exist')
    })
  })

  describe('Mobile controls toggle', () => {
    it('toggle button should exist for mobile use', () => {
      cy.get('[data-testid=mobile-controls-toggle]').should('exist')
    })
  })

  describe('Embeddable views', () => {
    it('renders controls and workspace split views', () => {
      cy.visit('http://localhost:3000/?embeddable=1')
      cy.get('[data-testid=controls-panel]').should('be.visible')
      cy.get('[data-testid=workspace]').should('be.visible')
      cy.get('[data-testid=workspace] .area-editor').should('exist')
    })

    it('applies shared embeddable theme styles to split views', () => {
      cy.visit('http://localhost:3000/?embeddable=1')
      cy.get('[data-testid=controls-panel]').should('have.class', 'layout-editor-theme')
      cy.get('[data-testid=workspace]').should('have.class', 'layout-editor-theme')
      cy.get('[data-testid=controls-panel]').should(($panel) => {
        expect(getComputedStyle($panel[0]).backgroundColor).to.not.equal('rgba(0, 0, 0, 0)')
      })
    })

    it('can switch between embeddable and standard views', () => {
      cy.visit('http://localhost:3000/?embeddable=1')
      cy.get('[data-testid=workspace]').should('be.visible')
      cy.get('[data-testid=controls-panel]').should('be.visible')

      cy.visit('http://localhost:3000/')
      cy.get('[data-testid=workspace]').should('be.visible')
      cy.get('[data-testid=controls-sidebar]').should('exist')
    })

    it('keeps workspace visible and interactive on mobile viewport', () => {
      cy.viewport('iphone-6')
      cy.visit('http://localhost:3000/?embeddable=1')

      cy.get('[data-testid=workspace]').should('be.visible')
      cy.get('[data-testid=workspace] .grid-cell').first().should('be.visible').click({ force: true })
      cy.get('[data-testid=controls-panel]').should('be.visible')
      cy.get('[data-testid=workspace]').then(($workspace) => {
        expect($workspace[0].getBoundingClientRect().width).to.be.greaterThan(300)
      })
    })
  })
})
