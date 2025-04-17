/* eslint-disable no-undef */
describe('Home Page Visual Regression', () => {
  beforeEach(() => {
    // Login before testing home page since it's a protected route
    cy.visit('/login')
    cy.get('#usernameInput').type('rahul', {force: true})
    cy.get('#passwordInput').type('rahul@2021', {force: true})
    cy.get('.login-btn').click({force: true})

    // Wait for redirect to home page
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('should match home page snapshot', () => {
    // Wait for the page to be fully loaded
    cy.get('.home-container').should('be.visible')
    cy.matchImageSnapshot()
  })

  it('should match home page mobile snapshot', () => {
    // Set viewport to mobile size
    cy.viewport(375, 667)
    cy.get('.home-container').should('be.visible')
    cy.matchImageSnapshot('home-page-mobile')
  })

  it('should match home page tablet snapshot', () => {
    // Set viewport to tablet size
    cy.viewport(768, 1024)
    cy.get('.home-container').should('be.visible')
    cy.matchImageSnapshot('home-page-tablet')
  })

  it('should match find jobs button hover state', () => {
    cy.get('.find-jobs-btn').should('be.visible')
    cy.get('.find-jobs-btn').trigger('mouseover', {force: true})
    cy.matchImageSnapshot('find-jobs-button-hover')
  })
})
