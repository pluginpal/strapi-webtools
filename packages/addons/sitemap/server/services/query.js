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
  const isLocalized = strapi.contentTypes[contentType].pluginOptions?.i18n?.localized;

  const pages = await noLimit(strapi, contentType, {
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
    locale: 'all',
    fields: isLocalized ? 'locale' : undefined,
    populate: {
      url_alias: {
        populate: 'url_path',
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
            populate: 'url_path',
          },
        },
      },
    },
    orderBy: 'id',
    publicationState: excludeDrafts ? 'live' : 'preview',
  });

  return pages;
};

/**
 * Query the IDs of the corresponding localization entities.
 *
 * @param {obj} contentType - The content type
 * @param {array} ids - Page ids
 *
 * @returns {object} The pages.
 */
const getLocalizationIds = async (contentType, ids) => {
  const isLocalized = strapi.contentTypes[contentType].pluginOptions?.i18n?.localized;
  const localizationIds = [];

  if (isLocalized) {
    const response = await strapi.entityService.findMany(contentType, {
      filters: { localizations: ids },
      locale: 'all',
      fields: ['id'],
    });

    response.map((localization) => localizationIds.push(localization.id));
  }

  return localizationIds;
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
  const sitemap = await strapi.entityService.findMany('plugin::webtools-addon-sitemap.sitemap', {
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
  const sitemaps = await strapi.entityService.findMany('plugin::webtools-addon-sitemap.sitemap', {
    filters: {
      name,
    },
    fields: ['id'],
  });

  await Promise.all(sitemaps.map(async (sm) => {
    await strapi.entityService.delete('plugin::webtools-addon-sitemap.sitemap', sm.id);
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

  const sitemap = await strapi.entityService.create('plugin::webtools-addon-sitemap.sitemap', {
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
  getLocalizationIds,
  createSitemap,
  getSitemap,
  deleteSitemap,
});
