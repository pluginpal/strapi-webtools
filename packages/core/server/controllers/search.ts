import { Context } from 'koa';
import { UID } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { getPluginService } from '../util/getPluginService';

/**
 * Search controller
 */
export default {
  search: async (ctx: Context & { params: { id: number } }) => {
    const { q } = ctx.query;
    const results = [];

    const qStr = typeof q === 'string' ? q.trim() : '';
    if (!qStr) {
      throw new errors.ValidationError('Missing or invalid query parameter "?q=" (must be a non-empty string)');
    }

    await Promise.all(
      Object.entries(strapi.contentTypes).map(async ([uid, config]: [UID.CollectionType, any]) => {
        const hasWT = isContentTypeEnabled(config);
        if (!hasWT) return;

        const mainField = await getPluginService('get-main-field').getMainField(uid);
        if (!mainField) return;

        const entries = await (strapi as any).documents(uid).findMany({
          filters: {
            [mainField]: { $containsi: qStr },
          },
          fields: [mainField, 'documentId'],
          populate: {
            url_alias: { fields: ['id'] },
          },
        });

        if (!entries || entries.length === 0) return;

        const entriesWithContentType = entries.map((entry: any) => ({
          ...entry,
          contentType: uid,
        }));

        results.push(...entriesWithContentType);
      }),
    );

    // @ts-ignore
    ctx.body = results;
  },
  reverseSearch: async (ctx: Context & { params: { contentType: string; documentId: string } }) => {
    const { contentType, documentId } = ctx.params;

    if (typeof contentType !== 'string' || !(contentType in strapi.contentTypes)) {
      throw new errors.ValidationError(`Unknown or invalid content type: ${contentType}`);
    }

    const mainField = await getPluginService('get-main-field').getMainField(contentType as UID.CollectionType);
    const entry = await (strapi as any).documents(contentType as UID.CollectionType).findOne({
      documentId,
      fields: ['id', 'documentId', ...(mainField ? [mainField] : [])],
    });

    if (!entry) {
      throw new errors.ValidationError('Entry not found');
    }

    ctx.body = {
      id: entry.id,
      documentId: entry.documentId,
      ...(mainField ? { [mainField]: entry[mainField] } : {}),
    };
  },
};
