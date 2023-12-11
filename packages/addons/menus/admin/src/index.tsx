import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { AdminApp } from '@pluginpal/webtools-helper-plugin';

import pluginPkg from '../../package.json';
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
      name: 'menu-link-edit-view',
      Component: EditView,
    });

    app.addSettingsLink('webtools', {
      id: 'menus',
      intlLabel: {
        id: getTrad('plugin.name'),
        defaultMessage: 'Menus',
      },
      to: '/settings/webtools/menus',
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
      locales.map((locale: string) => import(
        /* webpackChunkName: "sitemap-translation-[request]" */ `./translations/${locale}.json`
      )
        .then(({ default: data }) => ({
          data: prefixPluginTranslations(data as Record<string, string>, pluginId),
          locale,
        }))
        .catch(() => ({
          data: {},
          locale,
        }))),
    );

    return Promise.resolve(importedTrads);
  },
};
