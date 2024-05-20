import request from 'supertest';
// @ts-ignore
// eslint-disable-next-line import/no-relative-packages
import { setupStrapi, stopStrapi } from '../../../../../playground/tests/helpers';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Query layer decorator', () => {
  it('Create - Should generate a new URL alias', async () => {
    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some amazing new page',
      },
      populate: ['url_alias']
    });

    expect(page).toHaveProperty('url_alias.url_path', '/page/some-amazing-new-page');
    expect(page).toHaveProperty('url_alias.generated', true);
    expect(page).toHaveProperty('url_alias.contenttype', 'api::test.test');
  });

  it('Create - Should re-generate a pre-created URL alias if generated is set to true', async () => {
    const alias = await strapi.entityService.create("plugin::webtools.url-alias", {
      data: {
        url_path: '/generated-pre-created-path',
        generated: true,
        contenttype: 'api::test.test',
      },
    });

    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Generated amazing new page',
        url_alias: alias.id,
      },
      populate: ['url_alias']
    });

    expect(page).toHaveProperty('url_alias.id', alias.id);
    expect(page).toHaveProperty('url_alias.url_path', '/page/generated-amazing-new-page');
    expect(page).toHaveProperty('url_alias.generated', true);
    expect(page).toHaveProperty('url_alias.contenttype', 'api::test.test');
  });

  it('Create - Should not re-generate a pre-created URL alias if generated is set to false', async () => {
    const alias = await strapi.entityService.create("plugin::webtools.url-alias", {
      data: {
        url_path: '/pre-created-path',
        generated: false,
        contenttype: 'api::test.test',
      },
    });

    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some amazing new page',
        url_alias: alias.id,
      },
      populate: ['url_alias']
    });

    expect(page).toHaveProperty('url_alias.id', alias.id);
    expect(page).toHaveProperty('url_alias.url_path', '/pre-created-path');
    expect(page).toHaveProperty('url_alias.generated', false);
  });

  it('Update - Should generate a new URL alias if none is present', async () => {
    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some about to be updated new page',
      },
      populate: ['url_alias']
    });

    const oldAliasId = page.url_alias.id;

    // Delete the created url alias to make sure none is present
    // at the time of running the .update() query.
    await strapi.entityService.delete("plugin::webtools.url-alias", oldAliasId);

    const updatedPage = await strapi.entityService.update("api::test.test", page.id, {
      data: {
        // @ts-ignore
        title: 'Some updated page',
      },
      populate: ['url_alias']
    });

    expect(updatedPage?.url_alias?.id).not.toBe(oldAliasId);
    expect(updatedPage).toHaveProperty('url_alias.url_path', '/page/some-updated-page');
    expect(updatedPage).toHaveProperty('url_alias.generated', true);
    expect(updatedPage).toHaveProperty('url_alias.contenttype', 'api::test.test');
  });

  it('Update - Should re-generate an existing URL alias if generated is set to true', async () => {
    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some about to be updated new page',
      },
      populate: ['url_alias']
    });

    expect(page).toHaveProperty('url_alias.url_path', '/page/some-about-to-be-updated-new-page')
    expect(page).toHaveProperty('url_alias.generated', true);

    const updatedPage = await strapi.entityService.update("api::test.test", page.id, {
      data: {
        // @ts-ignore
        title: 'Some updated page with overwritten url alias',
      },
      populate: ['url_alias']
    });

    expect(updatedPage).toHaveProperty('url_alias.id', page.url_alias.id);
    expect(updatedPage).toHaveProperty('url_alias.url_path', '/page/some-updated-page-with-overwritten-url-alias');
    expect(updatedPage).toHaveProperty('url_alias.generated', true);
  });

  it('Update - Should not re-generate an existing URL alias if generated is set to false', async () => {
    const alias = await strapi.entityService.create("plugin::webtools.url-alias", {
      data: {
        url_path: '/path-should-not-update',
        generated: false,
        contenttype: 'api::test.test',
      },
    });

    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some about to be updated new page',
        url_alias: alias.id,
      },
      populate: ['url_alias']
    });

    expect(page).toHaveProperty('url_alias.url_path', '/path-should-not-update')
    expect(page).toHaveProperty('url_alias.generated', false);

    const updatedPage = await strapi.entityService.update("api::test.test", page.id, {
      data: {
        // @ts-ignore
        title: 'Some updated page',
      },
      populate: ['url_alias']
    });

    expect(updatedPage).toHaveProperty('url_alias.id', page.url_alias.id);
    expect(updatedPage).toHaveProperty('url_alias.url_path', '/path-should-not-update');
    expect(updatedPage).toHaveProperty('url_alias.generated', false);
  });

  it('Update - Should not duplicate check the same entry when updated', async () => {
    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Unpublished page',
      },
      populate: ['url_alias']
    });
    const url = page.url_alias.url_path;

    const updatedPage = await strapi.entityService.update("api::test.test", page.id, {
      data: {
        // @ts-ignore
        published_at: new Date(),
      },
      populate: ['url_alias']
    });

    expect(updatedPage).toHaveProperty('url_alias.url_path', url);
  });

  it('Delete - Should delete the corresponding URL alias as well', async () => {
    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some about to be deleted new page',
      },
      populate: ['url_alias']
    });

    expect(page).toHaveProperty('url_alias.url_path', '/page/some-about-to-be-deleted-new-page')
    expect(page).toHaveProperty('url_alias.generated', true);

    await strapi.entityService.delete("api::test.test", page.id);

    const alias = await strapi.entityService.findOne("plugin::webtools.url-alias", page.url_alias.id);

    expect(alias).toBeNull();
  });

  it('Clone - Should create a new entity with a cloned URL alias', async () => {
    const page = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Some page to clone',
      },
      populate: ['url_alias']
    });

    const clonedPage = await strapi.entityService.clone("api::test.test", page.id, {
      populate: ['url_alias']
    });

    expect(clonedPage).not.toBeNull();

    if (clonedPage) {
      const newUrlAliasPath = `${page.url_alias.url_path}-clone`;
      expect(clonedPage).toHaveProperty('url_alias.url_path', newUrlAliasPath);
      expect(clonedPage).toHaveProperty('url_alias.generated', true);
      expect(clonedPage).toHaveProperty('url_alias.contenttype', 'api::test.test');
      expect(clonedPage.id).not.toBe(page.id);
      expect(clonedPage.url_alias.id).not.toBe(page.url_alias.id);
    }
  });

  it('DeleteMany - Should delete multiple entities and their corresponding URL aliases', async () => {
    const page1 = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Page 1 to delete',
      },
      populate: ['url_alias']
    });

    const page2 = await strapi.entityService.create("api::test.test", {
      data: {
        title: 'Page 2 to delete',
      },
      populate: ['url_alias']
    });

    await strapi.entityService.deleteMany("api::test.test", {
      filters: { id: { $in: [page1.id, page2.id] } }
    });

    const alias1 = await strapi.entityService.findOne("plugin::webtools.url-alias", page1.url_alias.id);
    const alias2 = await strapi.entityService.findOne("plugin::webtools.url-alias", page2.url_alias.id);

    expect(alias1).toBeNull();
    expect(alias2).toBeNull();
  });
});
