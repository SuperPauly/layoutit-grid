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

    it('registers and removes the keydown listener on workspace mount/unmount', () => {
      cy.visit('http://localhost:3000/?embeddable=1', {
        onBeforeLoad(win) {
          cy.spy(win, 'addEventListener').as('addEventListener')
          cy.spy(win, 'removeEventListener').as('removeEventListener')
        },
      })

      cy.get('@addEventListener').should('be.calledWith', 'keydown')
      cy.visit('http://localhost:3000/')
      cy.get('@removeEventListener').should('be.calledWith', 'keydown')
    })
  })
})
