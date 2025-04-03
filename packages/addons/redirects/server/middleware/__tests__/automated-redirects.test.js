import { setupStrapi, stopStrapi } from '../../../../../../playground/tests/helpers';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Automated redirects middleware', () => {
  it('Should create a redirect when an URL alias changes when auto_generate is set to true', async () => {
    strapi.config.set('plugin::webtools-addon-redirects.auto_generate', true);

    let redirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
      filters: {
        from: '/test-url',
      },
    });

    expect(redirect).toBeNull();

    const alias = await strapi.documents('plugin::webtools.url-alias').create({
      data: {
        url_path: '/test-url',
        contenttype: 'api::test.test',
      },
    });

    await strapi.documents('plugin::webtools.url-alias').update({
      documentId: alias.documentId,
      data: {
        url_path: '/new-test-url',
      },
    });

    redirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
      filters: {
        from: '/test-url',
      },
    });

    expect(redirect).toMatchObject({
      from: '/test-url',
      to: '/new-test-url',
      status_code: 307,
    });
  });

  it('Should gracefully exit if creating a redirect has failed', async () => {

  });

  it('Should not create a redirect when an URL alias changes when auto_generate is set to false', async () => {
    strapi.config.set('plugin::webtools-addon-redirects.auto_generate', false);

    let redirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
      filters: {
        from: '/another-test-url',
      },
    });

    expect(redirect).toBeNull();

    const alias = await strapi.documents('plugin::webtools.url-alias').create({
      data: {
        url_path: '/another-test-url',
        contenttype: 'api::test.test',
      },
    });

    await strapi.documents('plugin::webtools.url-alias').update({
      documentId: alias.documentId,
      data: {
        url_path: '/another-new-test-url',
      },
    });

    redirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
      filters: {
        from: '/another-test-url',
      },
    });

    expect(redirect).toBeNull();
  });
});
