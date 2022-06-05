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
          defaultMessage: 'URL alias',
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.settings.page.list.title`,
            defaultMessage: 'List',
          },
          id: 'url-alias-list',
          to: `/settings/${pluginId}/list`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "url-alias-list" */ './screens/List'
            );

            return component;
          },
          permissions: pluginPermissions['settings.list'],
        },
        {
          intlLabel: {
            id: `${pluginId}.settings.page.patterns.title`,
            defaultMessage: 'Patterns',
          },
          id: 'url-alias-patterns',
          to: `/settings/${pluginId}/patterns`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "url-alias-patterns" */ './screens/Patterns'
            );

            return component;
          },
          permissions: pluginPermissions['settings.patterns'],
        },
      ],
    );
  },
  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'url-alias-edit-view',
      Component: EditView,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "url-alias-translation-[request]" */ `./translations/${locale}.json`
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
