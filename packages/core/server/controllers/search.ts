import { Context } from 'koa';
import { UID } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';

/**
 * Search controller
 */

export default {
  search: async (ctx: Context & { params: { id: number } }) => {
    const { q } = ctx.query;
    const { id } = ctx.params;
    let results = [];

    await Promise.all(Object.entries(strapi.contentTypes)
      .map(async ([uid, config]: [UID.CollectionType, any]) => {
        const hasWT = isContentTypeEnabled(uid);

        if (!hasWT) return;

        const coreStoreSettings = await strapi.query('strapi::core-store').findMany({
          where: {
            key: `plugin_content_manager_configuration_content_types::${uid}`,
          },
        });

        if (!coreStoreSettings[0]) return;

        const value = JSON.parse(coreStoreSettings[0].value);
        const { mainField } = value.settings;

        const entries = await strapi.entityService.findMany(uid, {
          filters: {
            [mainField]: {
              $containsi: q,
            },
          },
          fields: [mainField],
          populate: {
            url_alias: {
              fields: ['id'],
            },
          },
        });

        const entriesWithContentType = entries?.map((entry) => ({
          ...entry,
          contentType: uid,
        }));

        // eslint-disable-next-line max-len
        results = [...results, ...(Array.isArray(entriesWithContentType) ? entriesWithContentType : [])];
      }));

    // @ts-ignore
    ctx.body = results;
  },
  reverseSearch: async (ctx: Context & { params: { contentType: string; documentId: string } }) => {
    const { contentType, documentId } = ctx.params;

    // Zoek met filters via findMany omdat documentId geen primaire ID is
    const [entry] = await strapi.entityService.findMany(contentType as UID, {
      filters: { documentId },
      fields: ['id', 'title', 'documentId'],
      limit: 1,
    });

    if (!entry) {
      ctx.throw(404, 'Entry not found');
      return;
    }

    ctx.body = {
      id: entry.id,
      title: entry.title,
      slug: entry.slug,
      documentId: entry.documentId,
    };
  },
};
