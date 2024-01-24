/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import _ from 'lodash';
import { Schema } from '@strapi/strapi';
import { IStrapi } from '../types/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';

export default (strapi: IStrapi) => {
  // Register the url_alias field.
  Object.values(strapi.contentTypes).map(async (contentType: Schema.ContentType) => {
    const { attributes } = contentType;

    const migrated = await strapi.db
      .getConnection()
      .select('name')
      .where({
        name: 'to-native-relation',
      })
      .from('strapi_migrations');

    // Add a relation field to the url_alias content type, only
    // when webtools is explicitly enabled using pluginOptions.
    if (isContentTypeEnabled(contentType.uid) || migrated.length === 0) {
      _.set(attributes, 'url_alias', {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        default: null,
        type: 'relation',
        relation: 'oneToOne',
        target: 'plugin::webtools.url-alias',
        unique: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      });
    }

    // We explicitly check if the content type is enabled using the
    // old pluginId 'url-alias'. If it is, we add the old url_path_id
    // field one last time. After the 'plugin-options-rename' migration
    // this if statement will not be satisfied anymore.
    //
    // By doing this Strapi will bootstrap one single time with both
    // the old and the new fields in the database. This gives the opportunity
    // to easily migrate the data from the one to the other field.
    if (migrated.length === 0) {
      _.set(attributes, 'url_path_id', {
        writable: true,
        private: true,
        configurable: false,
        visible: false,
        default: null,
        type: 'string',
        unique: true,
        pluginOptions: {
          i18n: {
            localized: true,
          },
        },
      });
    }
  });

  // Register the pattern config type when using the config-sync plugin.
  if (strapi.plugin('config-sync')) {
    if (!strapi.plugin('config-sync').pluginTypes) {
      // eslint-disable-next-line no-param-reassign
      strapi.plugin('config-sync').pluginTypes = [];
    }

    strapi.plugin('config-sync').pluginTypes.push({
      configName: 'url-pattern',
      queryString: 'plugin::webtools.url-pattern',
      uid: 'code',
    });
  }
};
