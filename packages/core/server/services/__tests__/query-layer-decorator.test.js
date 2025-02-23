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
  it('Create - Should generate a new URL alias', async () => {
    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new page',
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/page/some-amazing-new-page');
    expect(page).toHaveProperty('url_alias[0].generated', true);
    expect(page).toHaveProperty('url_alias[0].contenttype', 'api::test.test');
  });

  it('Create - Should re-generate a pre-created URL alias if generated is set to true', async () => {
    const alias = await strapi.documents('plugin::webtools.url-alias').create({
      data: {
        url_path: '/generated-pre-created-path',
        generated: true,
        contenttype: 'api::test.test',
      },
    });

    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Generated amazing new page',
        url_alias: [alias.documentId],
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
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

    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some amazing new page',
        url_alias: [alias.documentId],
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].documentId', alias.documentId);
    expect(page).toHaveProperty('url_alias[0].url_path', '/pre-created-path');
    expect(page).toHaveProperty('url_alias[0].generated', false);
  });

  it('Update - Should generate a new URL alias if none is present', async () => {
    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be updated new page',
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    const oldAliasId = page.url_alias[0]?.documentId;

    console.log('aa', oldAliasId);

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
      populate: ['url_alias']
    });

    expect(updatedPage.url_alias[0]?.documentId).not.toBe(oldAliasId);
    expect(updatedPage).toHaveProperty('url_alias[0].url_path', '/page/some-updated-page');
    expect(updatedPage).toHaveProperty('url_alias[0].generated', true);
    expect(updatedPage).toHaveProperty('url_alias[0].contenttype', 'api::test.test');
  });

  it('Update - Should re-generate an existing URL alias if generated is set to true', async () => {
    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be updated new page',
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/page/some-about-to-be-updated-new-page')
    expect(page).toHaveProperty('url_alias[0].generated', true);

    let updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        title: 'Some updated page with overwritten url alias',
      },
    });

    updatedPage = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
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

    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be updated new page',
        url_alias: [alias.documentId],
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    expect(page).toHaveProperty('url_alias[0].url_path', '/path-should-not-update')
    expect(page).toHaveProperty('url_alias[0].generated', false);

    let updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        title: 'Some updated page',
      },
    });

    updatedPage = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    expect(updatedPage).toHaveProperty('url_alias[0].documentId', page.url_alias[0]?.documentId);
    expect(updatedPage).toHaveProperty('url_alias[0].url_path', '/path-should-not-update');
    expect(updatedPage).toHaveProperty('url_alias[0].generated', false);
  });

  it('Update - Should not duplicate check the same entry when updated', async () => {
    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Unpublished page',
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    const url = page.url_alias[0].url_path;

    let updatedPage = await strapi.documents('api::test.test').update({
      documentId: page.documentId,
      data: {
        published_at: new Date(),
      },
    });

    updatedPage = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    expect(updatedPage).toHaveProperty('url_alias[0].url_path', url);
  });

  it('Delete - Should delete the corresponding URL alias as well', async () => {
    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some about to be deleted new page',
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
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

  it('Clone - Should create a new entity with a cloned URL alias', async () => {
    let page = await strapi.documents('api::test.test').create({
      data: {
        title: 'Some page to clone',
      },
    });

    page = await strapi.documents('api::test.test').findOne({
      documentId: page.documentId,
      populate: ['url_alias'],
    });

    let clonedPage = await strapi.documents('api::test.test').clone({
      documentId: page.documentId,
      data: {},
    });

    clonedPage = await strapi.documents('api::test.test').findOne({
      documentId: clonedPage.documentId,
      populate: ['url_alias'],
    });

    expect(clonedPage).not.toBeNull();

    const newUrlAliasPath = `${page.url_alias[0].url_path}-0`;
    expect(clonedPage).toHaveProperty('url_alias[0].url_path', newUrlAliasPath);
    expect(clonedPage).toHaveProperty('url_alias[0].generated', true);
    expect(clonedPage).toHaveProperty('url_alias[0].contenttype', 'api::test.test');
    expect(clonedPage.documentId).not.toBe(page.documentId);
    expect(clonedPage.url_alias[0].documentId).not.toBe(page.url_alias[0].documentId);
  });
});
