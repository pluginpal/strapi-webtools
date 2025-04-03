import request from 'supertest';
import { setupStrapi, stopStrapi } from '../../../../../../playground/tests/helpers';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Redirect controller', () => {
  it('Should return a transformed response', async () => {
    const redirects = await request(strapi.server.httpServer)
      .get('/api/webtools/redirects')
      .expect(200)
      .then((data) => data.body);

    expect(redirects).toHaveProperty('data');
    expect(redirects).toHaveProperty('meta.pagination');
  });

  it('Should should be filterable', async () => {
    await strapi.documents('plugin::webtools-addon-redirects.redirect').create({
      data: {
        from: '/old-url',
        to: '/new-url',
        status_code: 307,
      },
    });

    const premanentRedirects = await request(strapi.server.httpServer)
      .get('/api/webtools/redirects?filters[status_code][$eq]=301')
      .expect(200)
      .then((data) => data.body);

    expect(premanentRedirects).toHaveProperty('data', []);

    const temporaryRedirects = await request(strapi.server.httpServer)
      .get('/api/webtools/redirects?filters[status_code][$eq]=307')
      .expect(200)
      .then((data) => data.body);

    expect(temporaryRedirects.data.length).toBeGreaterThan(0);
  });
});
