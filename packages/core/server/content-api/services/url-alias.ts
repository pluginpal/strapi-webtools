import { factories } from '@strapi/strapi';
import { EntityService, Common } from '@strapi/types';

/**
 * URL alias service
 */

const contentTypeSlug = 'plugin::webtools.url-alias';

export default factories.createCoreService(contentTypeSlug, ({ strapi }) => ({
  deleteMany: async (params: EntityService.Params.Pick<Common.UID.ContentType, 'filters'>) => {
    const toBeDeletedEntities = await strapi.entityService.findMany(contentTypeSlug, params);

    await Promise.all(toBeDeletedEntities.map(async (entity) => {
      await strapi.entityService.delete(contentTypeSlug, entity.id);
    }));

    return true;
  },
}));
