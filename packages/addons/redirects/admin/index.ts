/* eslint-disable @typescript-eslint/no-unsafe-call */

import { StrapiApp } from '@strapi/admin/strapi-admin';
import pluginId from './helpers/pluginId';
import { prefixPluginTranslations } from './helpers/prefixPluginTranslations';

import List from './screens/List';
import Create from './screens/Create';
import Edit from './screens/Edit';

export default {
  register() {},
  bootstrap(app: StrapiApp) {
    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'settings-route',
      // @ts-expect-error
      label: 'Redirects',
      path: '/redirects',
      Component: List,
    });
    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'settings-route',
      // @ts-expect-error
      path: '/redirects/new',
      Component: Create,
    });
    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'settings-route',
      // @ts-expect-error
      path: '/redirects/:id',
      Component: Edit,
    });
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
