import { Context } from 'koa';
import { UID, Schema } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { getPluginService } from '../util/getPluginService';

interface DocumentEntry {
  id: number;
  documentId: string;
  [key: string]: unknown; // Dynamic fields like title, etc.
}

interface SearchResult extends DocumentEntry {
  contentType: string;
}

/**
 * Search controller
 */
export default {
  search: async (ctx: Context & { params: { id: number } }) => {
    const { q } = ctx.query;
    const results: SearchResult[] = [];

    const qStr = typeof q === 'string' ? q.trim() : '';
    if (!qStr) {
      throw new errors.ValidationError('Missing or invalid query parameter "?q=" (must be a non-empty string)');
    }

    await Promise.all(
      Object.entries(strapi.contentTypes).map(
        async ([uid, config]: [UID.ContentType, Schema.ContentType]) => {
          const hasWT = isContentTypeEnabled(config);
          if (!hasWT) return;

          const mainField = await getPluginService('get-main-field').getMainField(uid);
          if (!mainField) return;

          const fieldsArr: string[] = ['documentId', ...(mainField ? [mainField] : [])];
          const entries = (await strapi.documents(uid).findMany({
            filters: {
              [mainField]: { $containsi: qStr },
            },
            // @ts-expect-error
            fields: fieldsArr,
          }));

          if (!entries || entries.length === 0) return;

          const entriesWithContentType: SearchResult[] = entries.map((entry: DocumentEntry) => ({
            ...entry,
            contentType: uid,
          }));

          results.push(...entriesWithContentType);
        },
      ),
    );

    ctx.body = results;
  },
  reverseSearch: async (ctx: Context & { params: { contentType: string; documentId: string } }) => {
    const { contentType, documentId } = ctx.params;

    if (typeof contentType !== 'string' || !(contentType in strapi.contentTypes)) {
      throw new errors.ValidationError(`Unknown or invalid content type: ${contentType}`);
    }

    const mainField = await getPluginService('get-main-field').getMainField(
      contentType as UID.ContentType,
    );
    // eslint-disable-next-line max-len
    const fieldsArr: string[] = ['id', 'documentId', ...(mainField ? [mainField] : [])];

    const entry = (await strapi
      .documents(contentType as UID.ContentType)
      .findOne({
        documentId,
        // @ts-expect-error
        fields: fieldsArr,
      }));

    if (!entry) {
      throw new errors.NotFoundError('Entry not found');
    }

    ctx.body = {
      id: entry.id,
      documentId: entry.documentId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...(mainField ? { [mainField]: entry[mainField] } : {}),
    };
  },
};
