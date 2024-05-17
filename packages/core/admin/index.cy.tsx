/// <reference types="cypress" />
//

describe('Webtools Core', () => {
  it('Load the homepage and check if somethings there', () => {
    cy.visit('/');
    cy.contains('The server is running successfully');
  });
});
