import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './helpers/pluginId';

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
  bootstrap() {
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
