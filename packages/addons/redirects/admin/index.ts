import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { AdminApp } from '@pluginpal/webtools-helper-plugin';
import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import getTrad from './helpers/getTrad';
import EditView from './components/EditView';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app: AdminApp) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });
  },
  bootstrap(app: AdminApp) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'redirects-edit-view',
      Component: EditView,
    });

    app.addSettingsLink('webtools', {
      id: 'redirects',
      intlLabel: {
        id: getTrad('plugin.name'),
        defaultMessage: 'Redirects',
      },
      to: '/settings/webtools/redirects',
      async Component() {
        const component = await import(
          /* webpackChunkName: "upload-settings" */ './pages/Settings'
        );

        return component;
      },
    });
  },
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        try {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const data = require(`./translations/${locale}.json`) as Record<string, string>;
          return {
            data: prefixPluginTranslations(data, pluginId),
            locale,
          };
        } catch {
          return {
            data: {},
            locale,
          };
        }
      }),
    );

    return Promise.resolve(importedTrads);
  },
};
