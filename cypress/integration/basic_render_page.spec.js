/// <reference types="cypress" />

describe('Layoutit! Basic Page Render', () => {
  describe('Workspace', () => {
    beforeEach(() => {
      cy.openApp()
    })

    it('grid workspace container should be visible', () => {
      cy.get('[data-testid=workspace]').should('be.visible')
    })
    it('area editor should be rendered inside the workspace', () => {
      cy.get('[data-testid=workspace] .area-editor').should('exist')
    })
  })

  describe('Controls sidebar', () => {
    beforeEach(() => {
      cy.openApp()
    })

    it('controls sidebar should be rendered', () => {
      cy.get('[data-testid=controls-sidebar]').should('exist')
    })
  })

  describe('Mobile controls toggle', () => {
    beforeEach(() => {
      cy.viewport(390, 844)
      cy.openApp()
    })

    afterEach(() => {
      cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight'))
    })

    it('toggle button should exist for mobile use', () => {
      cy.get('[data-testid=mobile-controls-toggle]').should('exist')
    })

    it('opens and closes controls drawer without blocking workspace interactions', () => {
      cy.get('[data-testid=workspace]').should('be.visible')

      cy.get('[data-testid=mobile-controls-toggle]').click()
      cy.get('[data-testid=controls-sidebar]').should('have.class', 'active').and('be.visible')

      cy.get('[data-testid=mobile-controls-toggle]').click()
      cy.get('[data-testid=controls-sidebar]').should('not.have.class', 'active')
      cy.get('[data-testid=workspace]').should('be.visible')

      cy.get('[data-testid=workspace] .area-editor').then(($editor) => {
        const pointerDownSpy = cy.spy().as('pointerDownSpy')
        $editor[0].addEventListener('pointerdown', pointerDownSpy, { once: true })
      })

      cy.get('[data-testid=workspace] .area-editor').trigger('pointerdown', {
        pointerType: 'touch',
        isPrimary: true,
      })

      cy.get('@pointerDownSpy').should('have.been.calledOnce')
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
