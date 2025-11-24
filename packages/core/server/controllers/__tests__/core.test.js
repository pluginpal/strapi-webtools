const request = require('supertest');
const { setupStrapi, stopStrapi } = require('../../../../../playground/tests/helpers');

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Core controller - Router', () => {
  it('Should return a 200 if a page was found', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&status=published')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty('data.title', 'Published test page');
    expect(page).toHaveProperty('data.contentType', 'api::test.test');
  });

  it('Should return a 404 if no page was found', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/does-not-exist')
      .expect(404)
      .then((data) => data.body);

    expect(page).toHaveProperty('data', null);
    expect(page).toHaveProperty('error.status', 404);
  });

  it('Should return a 403 if the user has insufficient rights', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/private-category/published')
      .expect(403)
      .then((data) => data.body);

    expect(page).toHaveProperty('data', null);
    expect(page).toHaveProperty('error.status', 403);
  });

  it('Should not fetch a draft entries by default', async () => {
    await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/unpublished-test-page')
      .expect(404);
  });

  it('Should fetch draft entries with status set to draft', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/unpublished-test-page&status=draft')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty('data.title', 'Unpublished test page');
  });

  it('Should allow query parameters for population', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/unpublished-test-page&status=draft&populate=*')
      .expect(200)
      .then((data) => data.body);

    expect(page.data.category).not.toBe(null);
  });

  it('Should sanitize populated relations without the "find" permission', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate=*')
      .expect(200)
      .then((data) => data.body);

    expect(page).not.toHaveProperty('data.private-category');
  });

  it('Should sanitize unpublished populated relations', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate=*')
      .expect(200)
      .then((data) => data.body);

    expect(page.data.category).toBe(null);
  });

  it('Should not sanitize unpublished populated relations with status set to draft', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate=*&status=draft')
      .expect(200)
      .then((data) => data.body);

    expect(page.data.category).not.toBe(null);
  });

  it('Should allow query parameters for field selection', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty('data.createdAt');

    const filteredPage = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&fields[0]=title')
      .expect(200)
      .then((data) => data.body);

    expect(filteredPage).not.toHaveProperty('data.createdAt');
    expect(page).toHaveProperty('data.title');
  });

  it('Should allow creator field population if the populateCreatorFields is true', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate[0]=createdBy&populate[1]=updatedBy')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty('data.createdBy');
    expect(page).toHaveProperty('data.updatedBy');
  });

  it('Should not allow creator field population if the populateCreatorFields is false', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/category/published-category')
      .expect(200)
      .then((data) => data.body);

    expect(page).not.toHaveProperty('data.createdBy');
    expect(page).not.toHaveProperty('data.updatedBy');
  });
});
