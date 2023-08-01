import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './helpers/pluginId';
import getTrad from './helpers/getTrad';
import EditView from './components/EditView';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });
  },
  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'sitemap-edit-view',
      Component: EditView,
    });

    app.addSettingsLink('webtools', {
      id: 'sitemap',
      intlLabel: {
        id: getTrad('plugin.name'),
        defaultMessage: 'Sitemap',
      },
      to: '/settings/webtools/sitemap',
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
          data: prefixPluginTranslations(data, pluginId) as string,
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
