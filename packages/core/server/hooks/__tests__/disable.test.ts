import { setupStrapi, stopStrapi } from '../../../../../playground/tests/helpers';
import { disableContentType } from '../disable';
import { pluginId } from '../../util/pluginId';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Hooks', () => {
  describe('Disable', () => {
    it('Should delete all the entries for a content type when it is disabled', async () => {
      const entry = await strapi.documents('api::test.test').create({
        data: {
          title: 'Some amazing new page',
        },
        populate: ['url_alias'],
      });

      const urlAlias = entry.url_alias as { documentId: string, url_path: string }[];
      expect(urlAlias).toBeDefined();

      const { documentId, url_path: urlPath } = urlAlias[0];
      expect(urlPath).not.toBeNull();

      const oldContentTypes = strapi.contentTypes;
      const contentTypes = {
        ...oldContentTypes,
        'api::test.test': {
          ...oldContentTypes['api::test.test'],
          pluginOptions: {
            ...oldContentTypes['api::test.test'].pluginOptions,
            webtools: {
              enabled: false,
            },
          },
        },
      };

      // @ts-expect-error - fix types for tests
      await disableContentType({ oldContentTypes, contentTypes });

      // The url alias should be deleted now
      const deletedEntry = await strapi.documents(`plugin::${pluginId}.url-alias`).findOne({
        documentId,
      });
      expect(deletedEntry).toBeNull();
    });
  });
});
