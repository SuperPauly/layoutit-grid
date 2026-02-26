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

    it('opens and closes controls drawer without blocking workspace interactions', () => {
      cy.viewport(390, 844)
      cy.openApp()

      cy.get('[data-testid=workspace]').should('be.visible')

      cy.get('[data-testid=mobile-controls-toggle]').click()
      cy.get('[data-testid=controls-sidebar]').should('have.class', 'active').and('be.visible')

      cy.get('[data-testid=mobile-controls-toggle]').click()
      cy.get('[data-testid=controls-sidebar]').should('not.have.class', 'active')
      cy.get('[data-testid=workspace]').should('be.visible')

      cy.get('[data-testid=workspace] .grid-cell:visible').first().click()
      cy.get('[data-testid=area-selection-name]').should('be.visible')
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
      cy.get('[data-testid=workspace] .grid-cell:visible').first().click()
      cy.get('[data-testid=area-selection-name]').should('be.visible')
      cy.get('[data-testid=controls-panel]').should('be.visible')
      cy.get('[data-testid=workspace]').then(($workspace) => {
        expect($workspace[0].getBoundingClientRect().width).to.be.greaterThan(300)
      })
    })

    it('removes the same resize listener reference on props sidebar unmount', () => {
      cy.visit('http://localhost:3000/?embeddable=1', {
        onBeforeLoad(win) {
          cy.spy(win, 'addEventListener').as('addEventListener')
          cy.spy(win, 'removeEventListener').as('removeEventListener')
        },
      })

      cy.visit('http://localhost:3000/')

      cy.get('@addEventListener').then((addSpy) => {
        const resizeAddCall = addSpy
          .getCalls()
          .find((call) => call.args[0] === 'resize' && typeof call.args[1] === 'function')

        expect(resizeAddCall, 'resize listener registration').to.exist

        cy.get('@removeEventListener').then((removeSpy) => {
          const resizeRemoveCall = removeSpy
            .getCalls()
            .find((call) => call.args[0] === 'resize' && typeof call.args[1] === 'function')

          expect(resizeRemoveCall, 'resize listener cleanup').to.exist
          expect(resizeRemoveCall.args[1], 'listener reference').to.equal(resizeAddCall.args[1])
        })
      })
    })
  })
})
