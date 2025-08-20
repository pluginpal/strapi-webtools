import { UID } from '@strapi/strapi';

export async function getMainField(uid: UID.CollectionType): Promise<string | null> {
  const coreStoreSettings = await strapi.query('strapi::core-store').findMany({
    where: { key: `plugin_content_manager_configuration_content_types::${uid}` },
  });
  if (!coreStoreSettings?.[0]) return null;

  const value = JSON.parse(coreStoreSettings[0].value);
  return value?.settings?.mainField ?? null;
}
