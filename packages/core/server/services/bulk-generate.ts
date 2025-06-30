import { UID } from '@strapi/strapi';

import { getPluginService } from '../util/getPluginService';
import { GenerationType } from '../types';

// Helper function to safely extract error message
function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err && 'message' in err) {
    const { message } = err as { message?: unknown };
    if (typeof message === 'string') {
      return message.toLowerCase();
    }
  }
  return '';
}

// Deadlock/locking retry helper for all major DBs
async function withDbLockRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 100,
): Promise<T | undefined> {
  for (let i = 0; i < retries; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await fn();
      return result;
    } catch (err: unknown) {
      // Safe type guard
      const msg: string = getErrorMessage(err);
      // Covers MySQL/MariaDB/Postgres/SQLite
      if (
        (
          msg.includes('deadlock') || // MySQL, MariaDB, Postgres
          msg.includes('could not serialize access') || // Postgres
          msg.includes('lock wait timeout') || // MySQL, MariaDB
          msg.includes('database is locked') // SQLite
        ) && i < retries - 1
      ) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((resolve) => { setTimeout(resolve, delay); });
        // continue is intentional and allowed here
        // eslint-disable-next-line no-continue
        continue;
      }
      throw err;
    }
  }
  // If all retries exhausted, throw an error (this satisfies consistent-return)
  throw new Error('withDbLockRetry: operation failed after max retries');
}

export interface GenerateParams {
  types: UID.ContentType[],
  generationType: GenerationType,
}

/**
 * Generate URL aliases based on given parameters.
 *
 * @param {GenerateParams} params - The parameters including types and generation type.
 * @returns {Promise<number>} - The total amount of generated URLs.
 */
const generateUrlAliases = async (params: GenerateParams): Promise<number> => {
  const { types, generationType } = params;
  let generatedCount = 0;

  // No concurrency: process each type one by one
  // eslint-disable-next-line no-restricted-syntax
  for (const type of types) {
    // Lock-safe delete operations
    if (generationType === 'all') {
      // Delete all the URL aliases for the given type.
      // eslint-disable-next-line no-await-in-loop
      await withDbLockRetry(() => strapi.db.query('plugin::webtools.url-alias').deleteMany({
        where: { contenttype: type },
      }));
    }

    if (generationType === 'only_generated') {
      // Delete all the auto generated URL aliases of the given type.
      // eslint-disable-next-line no-await-in-loop
      await withDbLockRetry(() => strapi.db.query('plugin::webtools.url-alias').deleteMany({
        where: { contenttype: type, generated: true },
      }));
    }

    let relations: string[] = [];
    let languages: string[] = [];

    // eslint-disable-next-line no-await-in-loop
    const locales = await strapi.documents('plugin::i18n.locale').findMany({});
    languages = locales.map((locale) => locale.code);

    // Get all relations for the type
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(languages.map(async (lang) => {
      const urlPatterns = await getPluginService('url-pattern').findByUid(type, lang);
      urlPatterns.forEach((urlPattern) => {
        const languageRelations = getPluginService('url-pattern').getRelationsFromPattern(urlPattern);
        relations = [...relations, ...languageRelations];
      });
    }));

    // Query all the entities of the type that do not have a corresponding URL alias.
    // eslint-disable-next-line no-await-in-loop
    const entities = await strapi.documents(type as 'api::test.test').findMany({
      filters: { url_alias: null },
      populate: {
        ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
        localizations: {
          populate: {
            ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
          },
        },
      },
    });

    /**
     * @todo
     * We should do a Promise.all(entities.map()) here to speed up the process.
     * Using that method we can create all the URL aliases in parallel.
     * Currently this is not possible due to the duplicateCheck function.
     * Race conditions can occur when two entities have the same URL path.
     */
    // eslint-disable-next-line no-restricted-syntax
    for (const entity of entities) {
      // eslint-disable-next-line no-await-in-loop
      const urlPatterns = await getPluginService('url-pattern').findByUid(type, entity.locale);
      const resolvedPath = getPluginService('url-pattern').resolvePattern(type, entity, urlPatterns[0]);

      // eslint-disable-next-line no-await-in-loop
      const newUrlAlias = await withDbLockRetry(() => strapi.documents('plugin::webtools.url-alias').create({
        data: {
          url_path: resolvedPath,
          generated: true,
          contenttype: type,
          locale: entity.locale,
        },
      }));

      // eslint-disable-next-line no-await-in-loop
      await withDbLockRetry(() => strapi.documents(type as 'api::test.test').update({
        documentId: entity.documentId,
        data: {
          url_alias: [newUrlAlias.documentId],
        },
      }));

      // Safe parallel localizations—OK for a handful of locales
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(entity.localizations.map(async (loc) => {
        const patterns = await getPluginService('url-pattern').findByUid(type, loc.locale);
        const path = getPluginService('url-pattern').resolvePattern(type, loc, patterns[0]);

        const alias = await withDbLockRetry(() => strapi.documents('plugin::webtools.url-alias').update({
          documentId: newUrlAlias.documentId,
          locale: loc.locale,
          data: {
            url_path: path,
            generated: true,
            contenttype: type,
            locale: entity.locale,
          },
        }));

        await withDbLockRetry(() => strapi.documents(type as 'api::test.test').update({
          documentId: entity.documentId,
          locale: loc.locale,
          data: {
            url_alias: [alias.documentId],
          },
        }));
      }));

      generatedCount += 1;
    }
  }

  return generatedCount;
};


export default () => ({
  generateUrlAliases,
});
