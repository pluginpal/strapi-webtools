import { UID } from '@strapi/strapi';

interface ContentManagerConfig {
  settings?: {
    mainField?: string;
  };
}

export const getMainField = async (uid: UID.CollectionType): Promise<string | null> => {
  const coreStoreSettings = await strapi.query('strapi::core-store').findMany({
    where: { key: `plugin_content_manager_configuration_content_types::${uid}` },
  }) as Array<{ value: string }>;

  if (!coreStoreSettings?.[0]) return null;

  const value = JSON.parse(coreStoreSettings[0].value) as ContentManagerConfig;

  return value?.settings?.mainField ?? null;
};

export default () => ({
  getMainField,
});
