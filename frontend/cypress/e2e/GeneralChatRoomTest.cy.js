describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')

    cy.contains('Start').click()

    cy.contains('Return').click()

    cy.contains('Start').click()

    const testName = 'Max Mustermann'
    cy.get('[id^=usernameInput]').last().type(testName)

    cy.contains('Join').click()

    cy.contains(testName)

    const testMessage = 'Ich bin ein Mustermann'
    cy.get('[id^=messageInput]').last().type(testMessage)

    cy.contains('send').click()

    cy.contains(testMessage)
  }) 
})