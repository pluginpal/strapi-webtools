import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import EditView from './components/EditView';
import App from './containers/App';
import { prefixPluginTranslations } from './helpers/prefixPluginTranslations';

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
      Component: App,
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
