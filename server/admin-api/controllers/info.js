'use strict';

const _ = require('lodash');

/**
 * Info controller
 */

module.exports = {
  getContentTypes: async (ctx) => {
    try {
      const contentTypes = [];

      await Promise.all(Object.values(strapi.contentTypes).map(async (contentType) => {
        const { pluginOptions } = contentType;

        // Not for CTs that are not visible in the content manager.
        const isInContentManager = _.get(pluginOptions, ['content-manager', 'visible']);
        if (isInContentManager === false) return;

        contentTypes.push({
          name: contentType.globalId,
          uid: contentType.uid,
        });
      }));

      ctx.send(contentTypes);
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },

  getLanguages: async (ctx) => {
     try {
       const formattedLocales = [];
      if (strapi.plugin('i18n')) {
        const locales = await strapi.query('plugin::i18n.locale').findMany();
        locales.map((locale) => {
          formattedLocales.push({
            name: locale.name,
            uid: locale.code,
          });
        });
        ctx.send(formattedLocales);
      } else {
        ctx.send([]);
      }
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  },
};
