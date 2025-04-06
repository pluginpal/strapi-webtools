import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'link',
    plugin: 'webtools-addon-links',
    type: 'string',
  });
};
