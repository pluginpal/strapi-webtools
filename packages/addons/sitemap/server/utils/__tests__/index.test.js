
'use strict';

const { logMessage } = require('..');

describe('Generic utilities', () => {
  it('Log message formatting', () => {
    const message = logMessage('An error occurred');

    expect(message).toEqual('[webtools-addon-sitemap]: An error occurred');

  });
});
