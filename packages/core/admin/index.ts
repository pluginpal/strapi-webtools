import { prefixPluginTranslations } from '@strapi/helper-plugin';
import * as yup from 'yup';
import pluginPkg from '../package.json';
import EditView from './components/EditView';
import pluginId from './helpers/pluginId';
import pluginPermissions from './permissions';
import { App } from './types/app';
import getTrad from './helpers/getTrad';
import CheckboxConfirmation from './components/ContentManagerHooks/ConfirmationCheckbox';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app: App) {
    console.log('test');

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
          id: 'webtools-list',
          to: `/settings/${pluginId}/list`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "webtools-list" */ './screens/List'
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
          id: 'webtools-patterns',
          to: `/settings/${pluginId}/patterns`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "webtools-patterns" */ './screens/Patterns'
            );

            return component;
          },
          permissions: pluginPermissions['settings.patterns'],
        },
      ],
    );
  },
  bootstrap(app: App) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'webtools-edit-view',
      Component: EditView,
    });

    const ctbPlugin = app.getPlugin('content-type-builder');

    if (ctbPlugin) {
      const ctbFormsAPI = ctbPlugin.apis.forms;
      // ctbFormsAPI.addContentTypeSchemaMutation(mutateCTBContentTypeSchema);
      ctbFormsAPI.components.add({ id: 'webtools.checkboxConfirmation', component: CheckboxConfirmation });

      ctbFormsAPI.extendContentType({
        validator: () => ({
          'webtools': yup.object().shape({
            enabled: yup.bool().default(true),
          }),
        }),
        form: {
          advanced() {
            return [
              {
                name: 'pluginOptions.webtools.enabled',
                description: {
                  id: getTrad('webtools.enabled.description-content-type'),
                  defaultMessage: 'Enable URL alias - allows urls to be created for this content type',
                },
                type: 'webtools.checkboxConfirmation',
                intlLabel: {
                  id: getTrad('webtools.enabled.label-content-type'),
                  defaultMessage: 'Url alias',
                },
              },
            ];
          },
        },
      });
    }
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "webtools-translation-[request]" */ `./translations/${locale}.json`
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
