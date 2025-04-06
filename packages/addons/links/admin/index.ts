/* eslint-disable @typescript-eslint/no-unsafe-call */

import { StrapiApp } from '@strapi/admin/strapi-admin';
import pluginId from './helpers/pluginId';
import { prefixPluginTranslations } from './helpers/prefixPluginTranslations';

import Icon from './components/Icon';

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'link',
      pluginId: 'webtools-addon-links', // the custom field is created by a webtools-addon-links plugin
      type: 'string', // the link will be stored as a string
      intlLabel: {
        id: 'webtools-addon-links.link.label',
        defaultMessage: 'Link',
      },
      intlDescription: {
        id: 'webtools-addon-links.link.description',
        defaultMessage: 'For internal and external links',
      },
      icon: Icon, // don't forget to create/import your icon component
      components: {
        Input: async () => import(
          /* webpackChunkName: "input-component" */ "./components/Input"
        ),
      },
      options: {
        // declare options here
      },
    });
  },
  bootstrap() {

  },
  async registerTrads(app: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return importedTranslations;
  },
};
