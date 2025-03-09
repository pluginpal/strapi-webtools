/* eslint-disable camelcase */

import { get } from 'lodash';
import xml2js from 'xml2js';

const parser = new xml2js.Parser({ attrkey: 'ATTR' });

import { noLimit, logMessage } from '../utils';

/**
 * Query service.
 */

/**
 * Query the nessecary pages from Strapi to build the sitemap with.
 *
 * @param {obj} config - The config object
 * @param {string} contentType - Query only entities of this type.
 * @param {array} ids - Query only these ids.
 *
 * @returns {object} The pages.
 */
const getPages = async (config, contentType, ids) => {
  const excludeDrafts = config.excludeDrafts && strapi.contentTypes[contentType].options.draftAndPublish;
  const isLocalized =
    strapi.contentTypes[contentType].pluginOptions?.i18n?.localized
    && strapi.plugin('i18n');

  const locales = await noLimit('plugin::i18n.locale', { fields: 'code' });
  let allPages = [];

  await Promise.all(locales.map(async (locale) => {
    const pages = await noLimit(contentType, {
      filters: {
        $or: [
          {
            sitemap_exclude: {
              $null: true,
            },
          },
          {
            sitemap_exclude: {
              $eq: false,
            },
          },
        ],
        id: ids ? {
          $in: ids,
        } : {},
      },
      locale: locale.code,
      fields: isLocalized ? 'locale' : undefined,
      populate: {
        url_alias: {
          populate: '*',
        },
        localizations: {
          fields: 'locale',
          filters: {
            $or: [
              {
                sitemap_exclude: {
                  $null: true,
                },
              },
              {
                sitemap_exclude: {
                  $eq: false,
                },
              },
            ],
          },
          populate: {
            url_alias: {
              populate: '*',
            },
          },
        },
      },
      orderBy: 'id',
      status: excludeDrafts ? 'published' : 'draft',
    });
    allPages = [...allPages, ...pages];
  }));

  return allPages;
};

/**
 * Get a sitemap from the database
 *
 * @param {string} name - The name of the sitemap
 * @param {number} delta - The delta of the sitemap
 * @param {array} fields - The fields array
 *
 * @returns {void}
 */
const getSitemap = async (name, delta, fields = ['sitemap_string']) => {
  const sitemap = await strapi.documents('plugin::webtools-addon-sitemap.sitemap').findMany({
    filters: {
      name,
      delta,
    },
    fields,
  });

  return sitemap[0];
};

/**
 * Delete a sitemap from the database
 *
 * @param {string} name - The name of the sitemap
 *
 * @returns {void}
 */
const deleteSitemap = async (name) => {
  const sitemaps = await strapi.documents('plugin::webtools-addon-sitemap.sitemap').findMany({
    filters: {
      name,
    },
    fields: ['id'],
  });

  await Promise.all(sitemaps.map(async (sm) => {
    await strapi.documents('plugin::webtools-addon-sitemap.sitemap').delete({
      documentId: sm.documentId,
    });
  }));
};

/**
 * Create a sitemap in the database
 *
 * @param {obj} data - The sitemap data
 *
 * @returns {void}
 */
const createSitemap = async (data) => {
  const {
    name,
    delta,
    type,
    sitemap_string,
  } = data;

  let linkCount = null;

  parser.parseString(sitemap_string, (error, result) => {
    if (error) {
      strapi.log.error(logMessage(`An error occurred while trying to parse the sitemap XML to json. ${error}`));
      throw new Error();
    } else if (type === 'index') {
      linkCount = get(result, 'sitemapindex.sitemap.length') || 0;
    } else {
      linkCount = get(result, 'urlset.url.length') || 0;
    }
  });

  const sitemap = await strapi.documents('plugin::webtools-addon-sitemap.sitemap').create({
    data: {
      sitemap_string,
      name,
      delta,
      type,
      link_count: linkCount,
    },
  });

  return sitemap.id;
};

export default () => ({
  getPages,
  createSitemap,
  getSitemap,
  deleteSitemap,
});
