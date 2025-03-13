'use strict';

export const getCoreStore = () => {
  return strapi.store({ type: 'plugin', name: 'webtools-addon-sitemap' });
};

export const logMessage = (msg = '') => `[webtools-addon-sitemap]: ${msg}`;

export const noLimit = async (queryString, parameters, limit = 5000) => {
  let entries = [];
  const amountOfEntries = await strapi.documents(queryString).count(parameters);

  for (let i = 0; i < (amountOfEntries / limit); i++) {
    /* eslint-disable-next-line */
    const chunk = await strapi.documents(queryString).findMany({
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
