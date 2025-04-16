import { setupStrapi, stopStrapi } from '../../../../../playground/tests/helpers';

// Higher timeout limit for slower machines
jest.setTimeout(30000); // 30 seconds now

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Query layer decorator', () => {
  it('Clone - Should create a new entity with a cloned URL alias', async () => {
    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some page to clone',
      },
      populate: ['url_alias'],
    });

    const clonedPage = await strapi.documents('api::test.test').clone({
      documentId: page.documentId,
      data: {},
      populate: ['url_alias'],
    });

    expect(clonedPage).not.toBeNull();

    const newUrlAliasPath = `${page.url_alias[0].url_path}-0`;
    expect(clonedPage).toHaveProperty('entries[0].url_alias[0].url_path', newUrlAliasPath);
    expect(clonedPage).toHaveProperty('entries[0].url_alias[0].generated', true);
    expect(clonedPage).toHaveProperty('entries[0].url_alias[0].contenttype', 'api::test.test');
    expect(clonedPage.documentId).not.toBe(page.documentId);
    expect(clonedPage.entries[0].url_alias[0].documentId).not.toBe(page.url_alias[0].documentId);
  });

  it('Create - Should generate a new URL alias', async () => {
    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new page',
      },
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-page');
    expect(page).toHaveProperty('url_alias[0].generated', true);
    expect(page).toHaveProperty('url_alias[0].contenttype', 'api::test.test');
  });

  it('Create - Should generate a unique URL alias for duplicate source content', async () => {
    const page1 = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new page duplicate',
      },
      populate: ['url_alias'],
    });
    const page2 = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new page duplicate',
      },
      populate: ['url_alias'],
    });

    expect(page1).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-page-duplicate');
    expect(page2).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-page-duplicate-0');
  });

  it('Create - Should generate a unique URL alias for duplicate source content across locales', async () => {
    const page1 = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new localized page',
      },
      locale: 'en',
      populate: ['url_alias'],
    });
    const page2 = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new localized page',
      },
      locale: 'nl',
      populate: ['url_alias'],
    });

    expect(page1).toHaveProperty('locale', 'en');
    expect(page2).toHaveProperty('locale', 'nl');
    expect(page1).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-localized-page');
    expect(page2).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-localized-page-0');
  });

  it('Create - Should generate a unique URL alias for duplicate source content across translated content', async () => {
    const english_page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new translated page',
      },
      locale: 'en',
      populate: ['url_alias'],
    });
    const dutch_page = await strapi.documents('api::test.test').update({
      documentId: english_page.documentId,
      data: {
        title: 'Some amazing new translated page',
      },
      locale: 'nl',
      populate: ['url_alias'],
    });

    expect(english_page).toHaveProperty('locale', 'en');
    expect(dutch_page).toHaveProperty('locale', 'nl');
    expect(dutch_page).toHaveProperty('documentId', english_page.documentId);
    expect(english_page).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-translated-page');
    expect(dutch_page).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-translated-page-0');
  });

  it('Create - Should allow duplicate URL alias for duplicate source content within locale if configured', async () => {
    try {
      strapi.config.set('plugin::webtools.unique_per_locale', true);

      const page1 = await strapi.documents('api::test.test')
        .create({
          data: {
            title: 'Some amazing new localized unique page',
          },
          locale: 'en',
          populate: ['url_alias'],
        });
      const page2 = await strapi.documents('api::test.test')
        .create({
          data: {
            title: 'Some amazing new localized unique page',
          },
          locale: 'nl',
          populate: ['url_alias'],
        });

      expect(page1)
        .toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-localized-unique-page');
      expect(page2)
        .toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-localized-unique-page');
    } finally {
      strapi.config.get('plugin::webtools.unique_per_locale', false);
    }
  });

  it('Create - Should re-generate a pre-created URL alias if generated is set to true', async () => {
    const alias = await strapi.documents('plugin::webtools.url-alias').create({
      data: {
        url_path: '/generated-pre-created-path',
        generated: true,
        contenttype: 'api::test.test',
      },
    });

    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Generated amazing new page',
        url_alias: [alias.documentId],
      },
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].documentId', alias.documentId);
    expect(page).toHaveProperty('url_alias[0].url_path', '/page/generated-amazing-new-page');
    expect(page).toHaveProperty('url_alias[0].generated', true);
    expect(page).toHaveProperty('url_alias[0].contenttype', 'api::test.test');
  });

  it('Create - Should not re-generate a pre-created URL alias if generated is set to false', async () => {
    const alias = await strapi.documents('plugin::webtools.url-alias').create({
      data: {
        url_path: '/pre-created-path',
        generated: false,
        contenttype: 'api::test.test',
      },
    });

    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new page',
        url_alias: [alias.documentId],
      },
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].documentId', alias.documentId);
    expect(page).toHaveProperty('url_alias[0].url_path', '/pre-created-path');
    expect(page).toHaveProperty('url_alias[0].generated', false);
  });

  it('Update - Should generate a new URL alias if none is present', async () => {
    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be updated new page',
      },
      populate: ['url_alias'],
    });

    const oldAliasId = page.url_alias[0]?.documentId;

    // Delete the created url alias to make sure none is present
    // at the time of running the .update() query.
    await strapi.documents('plugin::webtools.url-alias').delete({
      documentId: oldAliasId,
    });

    const updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        title: 'Some updated page',
      },
      populate: ['url_alias'],
    });

    expect(updatedPage.url_alias[0]?.documentId).not.toBe(oldAliasId);
    expect(updatedPage).toHaveProperty('url_alias[0].url_path', '/page/some-updated-page');
    expect(updatedPage).toHaveProperty('url_alias[0].generated', true);
    expect(updatedPage).toHaveProperty('url_alias[0].contenttype', 'api::test.test');
  });

  it('Update - Should re-generate an existing URL alias if generated is set to true', async () => {
    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be updated new page',
      },
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/page/some-about-to-be-updated-new-page')
    expect(page).toHaveProperty('url_alias[0].generated', true);

    const updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        title: 'Some updated page with overwritten url alias',
      },
      populate: ['url_alias'],
    });

    expect(updatedPage).toHaveProperty('url_alias[0].documentId', page.url_alias[0]?.documentId);
    expect(updatedPage).toHaveProperty('url_alias[0].url_path', '/page/some-updated-page-with-overwritten-url-alias');
    expect(updatedPage).toHaveProperty('url_alias[0].generated', true);
  });

  it('Update - Should not re-generate an existing URL alias if generated is set to false', async () => {
    const alias = await strapi.documents('plugin::webtools.url-alias').create({
      data: {
        url_path: '/path-should-not-update',
        generated: false,
        contenttype: 'api::test.test',
      },
    });

    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be updated new page',
        url_alias: [alias.documentId],
      },
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/path-should-not-update')
    expect(page).toHaveProperty('url_alias[0].generated', false);

    const updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        title: 'Some updated page',
      },
      populate: ['url_alias'],
    });

    expect(updatedPage).toHaveProperty('url_alias[0].documentId', page.url_alias[0]?.documentId);
    expect(updatedPage).toHaveProperty('url_alias[0].url_path', '/path-should-not-update');
    expect(updatedPage).toHaveProperty('url_alias[0].generated', false);
  });

  it('Update - Should not duplicate check the same entry when updated', async () => {
    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Unpublished page',
      },
      populate: ['url_alias'],
    });

    const url = page.url_alias[0].url_path;

    const updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        published_at: new Date(),
      },
      populate: ['url_alias'],
    });

    expect(updatedPage).toHaveProperty('url_alias[0].url_path', url);
  });

  it('Delete - Should delete the corresponding URL alias as well', async () => {
    const page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be deleted new page',
      },
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/page/some-about-to-be-deleted-new-page')
    expect(page).toHaveProperty('url_alias[0].generated', true);

    await strapi.documents('api::test.test').delete({
      documentId: page.documentId,
    });

    const alias = await strapi.documents('plugin::webtools.url-alias').findOne({
      documentId: page.url_alias[0]?.documentId,
    });

    expect(alias).toBeNull();
  });
});
