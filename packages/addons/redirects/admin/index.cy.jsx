describe('Redirects', () => {
  it('Create, Update, Filter on and Delete a redirect', () => {
    // Navigate to redirects list.
    cy.login();
    cy.navigateToAdminPage();
    cy.get('a[href="/admin/plugins/webtools/redirects"]').click();
    cy.contains('No redirects were found.');

    // Create a redirect.
    cy.get('button').contains('Add new redirect').click();
    cy.intercept({
      method: 'GET',
      url: '/webtools/redirects/config',
    }).as('getConfig');
    cy.wait('@getConfig').its('response.statusCode').should('equal', 200);
    cy.get('input[name="from"]').type('/old-url');
    cy.get('input[name="to"]').type('/new-url');
    cy.get('button').contains('Save redirect').click();
    cy.contains('The redirect was successfully created.');

    // Edit a redirect.
    cy.get('button').contains('Edit').click({ force: true });
    cy.get('input[name="to"]').clear();
    cy.get('input[name="to"]').type('/another-new-url');
    cy.get('button').contains('Save redirect').click();
    cy.contains('The redirect was successfully updated.');

    // Filter on a redirect.
    cy.contains('No redirects were found.').should('not.exist');
    cy.get('button').contains('Search').click({ force: true });
    cy.get('input[name="search"]').type('/no-url');
    cy.get('input[name="search"]').type('{enter}');
    cy.contains('No redirects were found.').should('exist');
    cy.get('input[name="search"]').clear();
    cy.get('input[name="search"]').type('old');
    cy.get('input[name="search"]').type('{enter}');
    cy.contains('No redirects were found.').should('not.exist');

    // Delete a redirect.
    cy.get('button').contains('Delete').click({ force: true });
    cy.get('div[role="alertdialog"] button').contains('Delete').click();
    cy.contains('The redirect was successfully deleted.');
    cy.get('div[role="alertdialog"]').should('not.exist');
    cy.contains('No redirects were found.');
  });
});
