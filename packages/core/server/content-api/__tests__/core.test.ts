import request from 'supertest';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import { setupStrapi, stopStrapi } from '../../../../../playground/tests/helpers';

beforeAll(async () => {
  jest.useFakeTimers();

  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Core controller - Router', () => {
  it('Should return a 200 if a page was found', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty('data.attributes.title', 'Published test page');
    expect(page).toHaveProperty('data.attributes.contentType', 'api::test.test');
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

  it('Should fetch a draft entries by default', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/unpublished-test-page')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty('data.attributes.title', 'Unpublished test page');
  });

  it('Should not fetch draft entries with publicationState set to live', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/unpublished-test-page&publicationState=live')
      .expect(404)
      .then((data) => data.body);
  });

  it('Should allow query parameters for population', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/unpublished-test-page&publicationState=preview&populate=*')
      .expect(200)
      .then((data) => data.body);

    expect(page.data.attributes.category.data).not.toBe(null);
  });

  it('Should sanitize populated relations without the "find" permission', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate=*')
      .expect(200)
      .then((data) => data.body);

    expect(page).not.toHaveProperty('data.attributes.private-category');
  });

  it('Should not sanitize unpublished populated relations', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate=*')
      .expect(200)
      .then((data) => data.body);

    expect(page.data.attributes.category.data).not.toBe(null);
  });

  it('Should sanitize unpublished populated relations with publicationState set to live', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&populate=*&publicationState=live')
      .expect(200)
      .then((data) => data.body);

    expect(page.data.attributes.category.data).toBe(null);
  });

  it('Should allow query parameters for field selection', async () => {
    const page = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page')
      .expect(200)
      .then((data) => data.body);

    expect(page).toHaveProperty("data.attributes.createdAt");

    const filteredPage = await request(strapi.server.httpServer)
      .get('/api/webtools/router?path=/page/published-test-page&fields[0]=title')
      .expect(200)
      .then((data) => data.body);

    expect(filteredPage).not.toHaveProperty("data.attributes.createdAt");
    expect(page).toHaveProperty("data.attributes.title");
  });

  // it('Should allow query parameters for localization', async () => {});
});
