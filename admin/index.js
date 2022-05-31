import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../package.json';
import EditView from './components/EditView';
import pluginId from './helpers/pluginId';
import pluginPermissions from './permissions';

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

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.settings.title`,
          defaultMessage: 'Path',
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.settings.title`,
            defaultMessage: 'Tools',
          },
          id: 'path-page',
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "path-settings-page" */ './containers/App'
            );

            return component;
          },
          permissions: pluginPermissions['settings'],
        },
      ],
    );
  },
  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'informations', {
      name: 'path-field-edit-view',
      Component: EditView,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "path-translation-[request]" */ `./translations/${locale}.json`
        )
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

    return Promise.resolve(importedTrads);
  },
};
