const { setupStrapi, stopStrapi } = require('./helpers');

jest.setTimeout(50000);

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Strapi is defined', () => {
  it('just works', () => {
    expect(strapi).toBeDefined();
  });
});
