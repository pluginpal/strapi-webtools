'use strict';

/**
 * Sitemap service.
 */

import { SitemapStream, streamToPromise, SitemapAndIndexStream } from 'sitemap';
import { isEmpty } from 'lodash';

import { logMessage, isValidUrl } from '../utils';
import { getPluginService } from '../utils/getPluginService';

/**
 * Add link x-default url to url bundles from strapi i18n plugin default locale.
 *
 * @param {object} config - The config object.
 * @param {object} links - The language links.
 * @param {object} defaultLocale - The language locale.
 *
 * @returns {object | undefined} The default language link.
 */
const getDefaultLanguageLink = (config, links, defaultLocale) => {
  if (config.defaultLanguageUrlType === 'default-locale') {
    // find url with default locale in generated bundle
    const url = links.find((link) => link.lang === defaultLocale)?.url;
    if (url) return { lang: 'x-default', url };
  }

  if (config.defaultLanguageUrlType === 'other' && config.defaultLanguageUrl) {
    return { lang: 'x-default', url: config.defaultLanguageUrl };
  }
};

/**
 * Get a formatted array of different language URLs of a single page.
 *
 * @param {object} config - The config object.
 * @param {object} page - The entity.
 * @param {string} contentType - The model of the entity.
 * @param {string} defaultURL - The default URL of the different languages.
 * @param {string} defaultLocale - The default locale.
 *
 * @returns {array} The language links.
 */
const getLanguageLinks = (config, page, contentType, defaultURL, defaultLocale) => {
  if (!page.localizations || page.localizations.length === 0) return null;

  const links = [];
  links.push({ lang: page.locale, url: defaultURL });

  page.localizations.map((translation) => {
    let { locale } = translation;

    // Return when there is no pattern for the page.
    if (
      !config.contentTypes[contentType]['languages'][locale]
      && config.contentTypes[contentType]['languages']['und']
    ) {
      locale = 'und';
    } else if (
      !config.contentTypes[contentType]['languages'][locale]
      && !config.contentTypes[contentType]['languages']['und']
    ) {
      return null;
    }

    if (!translation.url_alias[0]) {
      return null;
    }

    const translationUrl = translation.url_alias[0].url_path;

    let hostnameOverride = config.hostname_overrides[translation.locale] || '';
    hostnameOverride = hostnameOverride.replace(/\/+$/, '');
    links.push({
      lang: translation.locale,
      url: `${hostnameOverride}${translationUrl}`,
    });
  });

  // add optional x-default link url
  if (config.defaultLanguageUrlType) {
    const defaultLink = getPluginService('core').getDefaultLanguageLink(config, links, defaultLocale);
    if (defaultLink) links.push(defaultLink);
  }

  return links;
};

/**
 * Get a formatted sitemap entry object for a single page.
 *
 * @param {object} config - The config object.
 * @param {object} page - The entity.
 * @param {string} contentType - The model of the entity.
 * @param {string} defaultLocale - The default locale.
 * @param {bool} excludeDrafts - Whether to exclude drafts.
 *
 * @returns {object} The sitemap entry data.
 */
const getSitemapPageData = async (config, page, contentType, defaultLocale) => {
  let locale = page.locale || 'und';

  // Return when there is no pattern for the page.
  if (
    !config.contentTypes[contentType]['languages'][locale]
    && config.contentTypes[contentType]['languages']['und']
  ) {
    locale = 'und';
  } else if (
    !config.contentTypes[contentType]['languages'][locale]
    && !config.contentTypes[contentType]['languages']['und']
  ) {
    return null;
  }

  if (!page.url_alias[0]) {
    return null;
  }

  const path = page.url_alias[0].url_path;
  let hostnameOverride = config.hostname_overrides[page.locale] || '';
  hostnameOverride = hostnameOverride.replace(/\/+$/, '');
  const url = `${hostnameOverride}${path}`;

  const pageData = {
    lastmod: page.updatedAt,
    url,
    links: getPluginService('core').getLanguageLinks(config, page, contentType, url, defaultLocale),
    changefreq: config.contentTypes[contentType]['languages'][locale].changefreq || 'monthly',
    priority: parseFloat(config.contentTypes[contentType]['languages'][locale].priority) || 0.5,
  };

  if (config.contentTypes[contentType]['languages'][locale].includeLastmod === false) {
    delete pageData.lastmod;
  }

  return pageData;
};

/**
 * Get array of sitemap entries based on the plugins configurations.
 * @param {string} id - The sitemap ID.
 *
 * @returns {object} The sitemap entries.
 */
const createSitemapEntries = async (id) => {
  const config = await getPluginService('settings').getConfig();
  const sitemapConfig = config.sitemaps[id];
  let defaultLocale;

  if (strapi.plugin('i18n')) {
    const { getDefaultLocale } = strapi.plugin('i18n').service('locales');
    defaultLocale = await getDefaultLocale();
  }

  const sitemapEntries = [];

  // Collection entries.
  await Promise.all(Object.keys(sitemapConfig.contentTypes).map(async (contentType) => {
    // Query all the pages
    const pages = await getPluginService('query').getPages(sitemapConfig, contentType, sitemapConfig.languageFilter);

    // Add formatted sitemap page data to the array.
    await Promise.all(pages.map(async (page, i) => {
      const pageData = await getPluginService('core').getSitemapPageData(sitemapConfig, page, contentType, defaultLocale);
      if (pageData) {
        sitemapEntries.push(pageData);
      }
    }));

  }));


  // Custom entries.
  await Promise.all(Object.keys(sitemapConfig.customEntries).map(async (customEntry) => {
    sitemapEntries.push({
      url: customEntry,
      changefreq: sitemapConfig.customEntries[customEntry].changefreq,
      priority: parseFloat(sitemapConfig.customEntries[customEntry].priority),
    });
  }));

  // Custom homepage entry.
  if (sitemapConfig.includeHomepage) {
    const hasHomePage = !isEmpty(sitemapEntries.filter((entry) => entry.url === ''));

    // Only add it when no other '/' entry is present.
    if (!hasHomePage) {
      sitemapEntries.push({
        url: '/',
        changefreq: 'monthly',
        priority: 1,
      });
    }
  }

  return sitemapEntries;
};

/**
 * Write the sitemap xml file in the public folder.
 *
 * @param {string} filename - The file name.
 * @param {SitemapStream} sitemap - The SitemapStream instance.
 * @param {bool} isIndex - Is a sitemap index
 *
 * @returns {void}
 */
const saveSitemap = async (filename, sitemap, isIndex) => {
  return streamToPromise(sitemap)
    .then(async (sm) => {
      try {
        return await getPluginService('query').createSitemap({
          sitemap_string: sm.toString(),
          name: filename,
          delta: 0,
          type: isIndex ? 'index' : 'default_hreflang',
        });
      } catch (e) {
        strapi.log.error(logMessage(`Something went wrong while trying to write the sitemap XML to the database. ${e}`));
        throw new Error();
      }
    })
    .catch((err) => {
      strapi.log.error(logMessage(`Something went wrong while trying to build the sitemap with streamToPromise. ${err}`));
      throw new Error();
    });
};

/**
 * Get the SitemapStream instance.
 *
 * @param {number} urlCount - The amount of URLs.
 * @param {string} id - The sitemap ID.
 *
 * @returns {SitemapStream} - The sitemap stream.
 */
const getSitemapStream = async (urlCount, id) => {
  const config = await getPluginService('settings').getConfig();
  const LIMIT = strapi.config.get('plugin::webtools-addon-sitemap.limit');
  const enableXsl = strapi.config.get('plugin::webtools-addon-sitemap.xsl');
  const serverUrl = strapi.config.get('server.serverUrl');

  const xslObj = {};

  if (enableXsl) {
    xslObj.xslUrl = 'xsl/sitemap.xsl';
  }

  if (urlCount <= LIMIT) {
    return [new SitemapStream({
      hostname: config.sitemaps[id].hostname,
      ...xslObj,
    }), false];
  } else {

    return [new SitemapAndIndexStream({
      limit: LIMIT,
      ...xslObj,
      lastmodDateOnly: false,
      getSitemapStream: (i) => {
        const sitemapStream = new SitemapStream({
          hostname: config.sitemaps[id].hostname,
          ...xslObj,
        });
        const delta = i + 1;
        const path = `api/sitemap/index.xml?page=${delta}`;

        streamToPromise(sitemapStream)
          .then((sm) => {
            getPluginService('query').createSitemap({
              sitemap_string: sm.toString(),
              name: id,
              type: 'default_hreflang',
              delta,
            });
          });

        return [new URL(path, serverUrl || 'http://localhost:1337').toString(), sitemapStream];
      },
    }), true];
  }
};

/**
 * The main sitemap generation service.
 * @param {string} id - The sitemap ID.
 *
 * @returns {void}
 */
const createSitemap = async (id) => {
  const sitemapEntries = await getPluginService('core').createSitemapEntries(id);

  const config = await getPluginService('settings').getConfig();

  if (isEmpty(sitemapEntries)) {
    strapi.log.warn(logMessage('No sitemap XML was generated because there were 0 URLs configured.'));
    return;
  }

  if (!config.sitemaps[id].hostname) {
    strapi.log.warn(logMessage('No sitemap XML was generated because there was no hostname configured.'));
    return;
  }

  if (!isValidUrl(config.sitemaps[id].hostname)) {
    strapi.log.warn(logMessage('No sitemap XML was generated because the hostname was invalid'));
    return;
  }

  await getPluginService('query').deleteSitemap(id);
  const [sitemap, isIndex] = await getSitemapStream(sitemapEntries.length, id);

  sitemapEntries.map((sitemapEntry) => sitemap.write(sitemapEntry));
  sitemap.end();

  await getPluginService('core').saveSitemap(id, sitemap, isIndex);

  strapi.log.info(logMessage('The sitemap XML has been generated. It can be accessed on /api/sitemap/index.xml.'));
};

export default () => ({
  getDefaultLanguageLink,
  getLanguageLinks,
  getSitemapPageData,
  createSitemapEntries,
  saveSitemap,
  createSitemap,
});
