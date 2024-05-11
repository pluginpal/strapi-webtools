/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AdminApp } from '@pluginpal/webtools-helper-plugin';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import * as yup from 'yup';
import pluginPkg from '../package.json';
import EditView from './components/EditView';
import pluginId from './helpers/pluginId';
import pluginPermissions from './permissions';
import getTrad from './helpers/getTrad';
import CheckboxConfirmation from './components/ContentManagerHooks/ConfirmationCheckbox';

import dutchTranslations from './translations/nl.json';
import englishTranslations from './translations/en.json';
import { PluginIcon } from './components/PluginIcon';

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

    app.addMenuLink({
      to: '/plugins/webtools',
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.settings.title`,
        defaultMessage: 'Webtools',
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "webtools-list" */ './containers/App'
        );

        return component;
      },
      permissions: [], // permissions to apply to the link
    });
  },
  bootstrap(app: AdminApp) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'url-alias-edit-view',
      Component: EditView,
    });

    const ctbPlugin = app.getPlugin('content-type-builder');

    if (ctbPlugin) {
      const ctbFormsAPI = ctbPlugin.apis.forms;
      ctbFormsAPI.components.add({ id: 'webtools.checkboxConfirmation', component: CheckboxConfirmation });

      ctbFormsAPI.extendContentType({
        validator: () => ({
          webtools: yup.object().shape({
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
                  defaultMessage: 'Webtools - entries of this type are considered web pages.',
                },
                type: 'webtools.checkboxConfirmation',
                intlLabel: {
                  id: getTrad('webtools.enabled.label-content-type'),
                  defaultMessage: 'Webtools',
                },
              },
            ];
          },
        },
      });
    }
  },
  async registerTrads() {
    return Promise.resolve([
      {
        data: prefixPluginTranslations(englishTranslations, pluginId),
        locale: 'en',
      },
      {
        data: prefixPluginTranslations(dutchTranslations, pluginId),
        locale: 'nl',
      },
    ]);
  },
};
