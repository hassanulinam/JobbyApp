/* eslint-disable no-undef */
describe('Login Page Visual Regression', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should match login page snapshot', () => {
    // Wait for the page to be fully loaded
    cy.get('.login-form-container').should('be.visible')

    // Take a snapshot of the login page
    cy.matchImageSnapshot()
  })

  it('should match input focus state snapshot', () => {
    // Focus the username input with force option
    cy.get('#usernameInput').focus({force: true})

    // Take a snapshot with the input focused
    cy.matchImageSnapshot('login-input-focused')
  })

  it('should match error state snapshot', () => {
    // Focus and blur username and password fields to trigger validation
    cy.get('#usernameInput').focus({force: true}).blur({force: true})
    cy.get('#passwordInput').focus({force: true}).blur({force: true})

    // Click login button to trigger form validation
    cy.get('.login-btn').click({force: true})

    // Wait for error messages to appear
    cy.get('.error-message').should('exist')

    // Take a snapshot of the error state
    cy.matchImageSnapshot('login-error-state')
  })

  it('should match filled form snapshot', () => {
    // Fill in the form with force option
    cy.get('#usernameInput').type('rahul', {force: true})
    cy.get('#passwordInput').type('rahul@2021', {force: true})

    // Take a snapshot of the filled form
    cy.matchImageSnapshot('login-filled-form')
  })
})
