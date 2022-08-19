'use strict';

const _ = require('lodash');

const { getPluginService } = require('../../util/getPluginService');

module.exports = () => ({
  initialize: () => {
    const queryAPIs = [strapi.entityService, strapi.db.query, strapi.query];
    const methods = ['findMany', 'findOne'];

    queryAPIs.map((API) => {
      methods.map((method) => {
        API[method] = (() => {
          const storedMethod = API[method];

          return async function() {
            // eslint-disable-next-line prefer-rest-params
            let response = await storedMethod.apply(this, arguments);
            response = await getPluginService('preparePathService').response(response);
            return response;
          };
        })();
      });
    });
  },
});
