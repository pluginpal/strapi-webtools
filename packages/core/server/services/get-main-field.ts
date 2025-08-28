import { UID } from '@strapi/strapi';

interface ContentManagerConfig {
  settings?: {
    mainField?: string;
  };
}

export const getMainField = async (uid: UID.ContentType): Promise<string | null> => {
  const coreStoreSettings = (await strapi
    .query('strapi::core-store' as unknown as UID.Schema)
    .findMany({
      where: { key: `plugin_content_manager_configuration_content_types::${uid}` },
    })) as Array<{ value: string }>;

  if (!coreStoreSettings?.[0]) return null;

  const value = JSON.parse(coreStoreSettings[0].value) as ContentManagerConfig;

  return value?.settings?.mainField ?? null;
};

export default () => ({
  getMainField,
});
