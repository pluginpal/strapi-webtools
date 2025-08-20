import { Context } from 'koa';
import { UID } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { getMainField } from '../services/get-main-field';

/**
 * Search controller
 */
export default {
  search: async (ctx: Context & { params: { id: number } }) => {
    const { q } = ctx.query;
    const { id } = ctx.params;
    let results = [];

    const qStr = typeof q === 'string' ? q.trim() : '';
    if (!qStr) {
      ctx.throw(400, 'Missing or invalid query parameter "?q=" (must be a non-empty strin4g)');
      return;
    }

    await Promise.all(
      Object.entries(strapi.contentTypes).map(async ([uid, config]: [UID.CollectionType, any]) => {
        const hasWT = isContentTypeEnabled(config);
        if (!hasWT) return;

        const mainField = await getMainField(uid);
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
      ctx.throw(400, `Unknown or invalid content type: ${contentType}`);
      return;
    }

    const mainField = await getMainField(contentType as UID.CollectionType);

    const entry = await (strapi as any).documents(contentType as UID.CollectionType).findOne({
      documentId,
      fields: ['id', 'documentId', ...(mainField ? [mainField] : [])],
    });

    if (!entry) {
      ctx.throw(404, 'Entry not found');
      return;
    }

    ctx.body = {
      id: entry.id,
      documentId: entry.documentId,
      ...(mainField ? { [mainField]: entry[mainField] } : {}),
    };
  },
};
