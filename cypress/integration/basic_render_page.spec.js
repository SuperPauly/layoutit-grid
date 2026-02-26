/// <reference types="cypress" />

describe('Layoutit! Basic Page Render', () => {
  const excludedUiMarkers = [
    { type: 'selector', value: '.code-sidebar' },
    { type: 'selector', value: '.code-container' },
    { type: 'selector', value: '.copy-button' },
    { type: 'selector', value: 'form#codepenForm' },
    { type: 'selector', value: '.btn-github' },
    { type: 'selector', value: 'a[aria-label="View source on GitHub"]' },
    { type: 'selector', value: '[data-testid=version-selector]' },
    { type: 'selector', value: '.brand-logo' },
    { type: 'selector', value: '[data-testid=brand-logo-image]' },
    { type: 'selector', value: '[data-testid=brand-logo-svg]' },
    { type: 'selector', value: '.header' },
    { type: 'text', value: 'CodePen' },
    { type: 'text', value: 'Stackblitz' },
  ]

  const assertLayoutEditorOnlyUi = () => {
    excludedUiMarkers.forEach(({ type, value }) => {
      if (type === 'selector') {
        cy.get(value).should('not.exist')
        return
      }

      cy.contains('button, a, span, div', value).should('not.exist')
    })
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
    it('controls sidebar should be rendered with a layout editor heading', () => {
      cy.get('[data-testid=controls-sidebar]').should('exist')
      cy.get('[data-testid=controls-sidebar] [data-testid=layout-editor-title]')
        .should('be.visible')
        .and('have.text', 'Layout Editor')
    })
  })

  describe('Layout editor only composition boundary', () => {
    it('primary route never mounts legacy sidebar, export, github, brand, or version controls', () => {
      assertLayoutEditorOnlyUi()
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
      cy.get('[data-testid=controls-sidebar] [data-testid=layout-editor-title]')
        .should('be.visible')
        .and('have.text', 'Layout Editor')

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
        cy.get('[data-testid=controls-panel] [data-testid=layout-editor-title]')
          .should('be.visible')
          .and('have.text', 'Layout Editor')
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
      cy.visit('http://localhost:3000/', {
        onBeforeLoad(win) {
          cy.spy(win, 'addEventListener').as('addEventListener')
          cy.spy(win, 'removeEventListener').as('removeEventListener')
        },
      })

      cy.visit('http://localhost:3000/?embeddable=1')

      cy.get('@addEventListener').then((addSpy) => {
        const resizeAddCalls = addSpy
          .getCalls()
          .filter((call) => call.args[0] === 'resize' && typeof call.args[1] === 'function')

        cy.get('@removeEventListener').then((removeSpy) => {
          const resizeRemoveCalls = removeSpy
            .getCalls()
            .filter((call) => call.args[0] === 'resize' && typeof call.args[1] === 'function')

          if (!resizeAddCalls.length) {
            expect(resizeRemoveCalls, 'no cleanup without registration').to.have.length(0)
            return
          }

          expect(resizeRemoveCalls, 'resize listener cleanup').to.have.length.greaterThan(0)
          const listenerReferences = resizeRemoveCalls.map((call) => call.args[1])
          expect(listenerReferences, 'listener reference').to.include(resizeAddCalls[0].args[1])
        })
      })
    })
  })
})
