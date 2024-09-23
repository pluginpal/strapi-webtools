'use strict';

export const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'webtools-addon-sitemap' });
};

export const getService = (name) => {
  return strapi.plugin('webtools-addon-sitemap').service(name);
};

export const logMessage = (msg = '') => `[webtools-addon-sitemap]: ${msg}`;

export const noLimit = async (strapi, queryString, parameters, limit = 5000) => {
  let entries = [];
  const amountOfEntries = await strapi.entityService.count(queryString, parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await strapi.entityService.findMany(queryString, {
      ...parameters,
      limit: limit,
      start: (i * limit),
    });
    if (chunk.id) {
      entries = [chunk, ...entries];
    } else {
      entries = [...chunk, ...entries];
    }
  }

  return entries;
};

export const isValidUrl = (url) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
