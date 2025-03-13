const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1337',
    specPattern: '**/*.cy.{js,ts,jsx,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here.
      require('cypress-terminal-report/src/installLogsPrinter')(on);
    },
    video: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
  },
});
