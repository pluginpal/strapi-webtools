import _ from 'lodash';
import { Schema } from '@strapi/strapi';
import { IStrapi } from '../../types/strapi';

const migratePluginOptionsRename = (strapi: IStrapi) => {
  Object.values(strapi.contentTypes).forEach((contentType: Schema.ContentType) => {
    const deprecatedPluginOptions = _.get(contentType.pluginOptions, ['url-alias'], null) as object;

    if (deprecatedPluginOptions === null) {
      return;
    }

    const updatedContentType: Schema.ContentType = contentType;

    // Delete the old plugin options
    delete updatedContentType.pluginOptions['url-alias'];

    // Set the new options
    // @ts-ignore
    updatedContentType.pluginOptions.webtools = deprecatedPluginOptions;

    // Format the content type
    /* disabled the no-unsafe-call linting rule */
    /* we do that because strapi.services is not properly typed  */
    /* maby we can remove this in the future  */
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    const formattedContentType = strapi.services['plugin::content-type-builder.content-types']
      .formatContentType(updatedContentType) as { schema: object };

    // Update the content type
    strapi.services['plugin::content-type-builder.content-types'].editContentType(
      contentType.uid,
      { contentType: formattedContentType.schema },
    );
  });
};

export default migratePluginOptionsRename;
