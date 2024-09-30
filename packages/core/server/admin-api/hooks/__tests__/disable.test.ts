import { Shared } from '@strapi/strapi';
import { setupStrapi, stopStrapi } from '../../../../../../playground/tests/helpers';
import { disableContentType } from '../disable';
import { pluginId } from '../../../util/pluginId';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Hooks', () => {
  describe('Disable', () => {
    it('Should delete all the entries for a content type when it is disabled', async () => {
      const entry = await strapi.entityService.create("api::test.test", {
        data: {
          title: 'Some amazing new page',
        },
        populate: ['url_alias']
      });

      const urlAlias = entry.url_alias;
      expect(urlAlias).toBeDefined();
      
      const id: number | string = urlAlias[0].id;
      const urlPath: string | null = urlAlias.url_path;
      expect(urlPath).not.toBeNull();

      const oldContentTypes = strapi.contentTypes;
      const contentTypes: Shared.ContentTypes = {
        ...oldContentTypes,
        'api::test.test': {
          ...oldContentTypes['api::test.test'],
          pluginOptions: {
            ...oldContentTypes['api::test.test'].pluginOptions,
            webtools: {
              // @ts-expect-error - This is a test case and it should be able to set this to false
              enabled: false,
            },
          },
        },
      };

      // @ts-expect-error - fix types for tests
      await disableContentType({ oldContentTypes, contentTypes });

      // The url alias should be deleted now
      // @ts-expect-error - fix types for tests
      const deletedEntry = await strapi.entityService.findOne(`plugin::${pluginId}.url-alias`, id);
      expect(deletedEntry).toBeNull();
    });
  });
});
