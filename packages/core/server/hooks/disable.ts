import { Schema } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';
import { pluginId } from '../util/pluginId';

export const disableContentType = async ({ oldContentTypes, contentTypes }: {
  oldContentTypes?: null | {
    [uid in keyof Schema.ContentTypes]?: Schema.ContentTypes[uid];
  } & {
    [uid: string]: Schema.ContentType;
  },
  contentTypes: {
    [uid in keyof Schema.ContentTypes]: Schema.ContentTypes[uid];
  } & {
    [uid: string]: Schema.ContentType;
  },
}) => {
  if (!oldContentTypes) {
    return;
  }

  await Promise.all(Object.keys(oldContentTypes).map(async (uid) => {
    const oldContentType = oldContentTypes[uid];
    if (!oldContentType) {
      // This means that the content type must have just been created,
      // so we should not do anything here
      return;
    }

    // This content type could be undefined if the content type was just deleted
    const contentType = contentTypes[uid];

    const wasEnabled = isContentTypeEnabled(oldContentType);
    const isEnabled = contentType && isContentTypeEnabled(contentType);


    if (!wasEnabled || isEnabled) {
      return;
    }

    // remove old paths from the database
    await strapi.db.query(`plugin::${pluginId}.url-alias`).deleteMany({
      where: {
        contenttype: uid,
      },
    });
  }));
};
