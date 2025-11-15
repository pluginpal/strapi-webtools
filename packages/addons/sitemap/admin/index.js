import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import EditView from './components/EditView';
import { prefixPluginTranslations } from './helpers/prefixPluginTranslations';
import SitemapSettings from './screens/Settings';
import SitemapOverview from './screens/Overview';

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
    app.getPlugin('webtools').injectComponent('webtoolsSidePanel', 'link', {
      Component: EditView,
    });

    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'settings-route',
      label: 'Sitemap',
      path: '/sitemap',
      Component: SitemapOverview,
    });

    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'sitemap-route',
      path: '/sitemap/:id',
      Component: SitemapSettings,
    });
  },
  async registerTrads(app) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      locales.map((locale) => {
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
