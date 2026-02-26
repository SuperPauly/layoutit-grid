/// <reference types="cypress" />

describe('Layoutit! Basic Page Render', () => {
  const assertLayoutEditorOnlyUi = () => {
    // Right code/output panel and code editor controls
    cy.get('.code-sidebar').should('not.exist')
    cy.get('.code-container').should('not.exist')
    cy.get('.copy-button').should('not.exist')

    // Export controls and external sandbox buttons
    cy.contains('button, a', 'CodePen').should('not.exist')
    cy.contains('button, a', 'Stackblitz').should('not.exist')
    cy.get('form#codepenForm').should('not.exist')

    // Top-right GitHub link/button
    cy.get('.btn-github').should('not.exist')
    cy.get('a[aria-label="View source on GitHub"]').should('not.exist')

    // Version selector and brand/header controls
    cy.get('[data-testid=version-selector]').should('not.exist')
    cy.get('.brand-logo').should('not.exist')
    cy.get('[data-testid=brand-logo-image]').should('not.exist')
    cy.get('[data-testid=brand-logo-svg]').should('not.exist')
    cy.get('.header').should('not.exist')
  }

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

    ;[
      { label: 'desktop', viewport: [1280, 800] },
      { label: 'mobile', viewport: [390, 844] },
    ].forEach(({ label, viewport }) => {
      it(`does not render right-side code and brand controls in ${label} viewport`, () => {
        cy.viewport(...viewport)
        cy.visit('http://localhost:3000/?embeddable=1')

        assertLayoutEditorOnlyUi()
      })
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
