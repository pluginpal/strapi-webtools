/// <reference types="cypress" />
//

describe('Webtools Core', () => {
  it('Load the homepage and check if somethings there', () => {
    cy.visit('/');
    // eslint-disable-next-line quotes
    cy.contains("Let's get started!");
  });
});
