'use strict';

import { getPluginService } from '../../util/getPluginService';

export default () => ({
  /**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
  create: async (data) => {
    const duplicateCheck = async (ext = -1) => {
      const extension = ext >= 0 ? `-${ext}` : '';
      const pathAllreadyExists = await getPluginService('pathService').findByPath(data.url_path + extension);

      if (pathAllreadyExists) {
        await duplicateCheck(ext + 1);
      } else {
        data.url_path = data.url_path + extension;
      }
    };

    await duplicateCheck();

    const pathEntity = await strapi.entityService.create('plugin::webtools.path', {
      data,
    });

    return pathEntity;
  },

  /**
   * findOne.
   *
   * @param {number} id the id.
   * @returns {void}
   */
  findOne: async (id) => {
    const pathEntity = await strapi.entityService.findOne('plugin::webtools.path', id);

    return pathEntity;
  },

  /**
   * findMany.
   *
   * @param {boolean} showDrafts wheter to include the drafts.
   * @param {object} query the entity service query.
   * @returns {void}
   */
  findMany: async (showDrafts: boolean = false, query: Record<string, any> = {}) => {
    const excludeDrafts = false;

    // Check drafAndPublish setting.
    if (!showDrafts) {
      // TODO:
      // Exclude draft URLs.
      // We need to check the publication status of the linked entity.
    }

    const { results, pagination } = await strapi.entityService.findPage('plugin::webtools.path', {
      ...query,
      filters: {
        ...query?.filters,
        published_at: excludeDrafts ? {
          $notNull: true,
        } : {},
      },
    });

    return { results, pagination };
  },

  /**
   * findByPath.
   *
   * @param {string} path the path.
   * @param {number} id the id to ignore.
   * @returns {void}
   */
  findByPath: async (path, id = 0) => {
    const pathEntity = await strapi.entityService.findMany('plugin::webtools.path', {
      filters: {
        url_path: path,
        id: {
          $not: id,
        },
      },
      limit: 1,
    });

    return pathEntity[0];
  },

  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {object} data the data.
   * @returns {void}
   */
  update: async (id, data) => {
    const duplicateCheck = async (ext = -1) => {
      const extension = ext >= 0 ? `-${ext}` : '';
      const pathAllreadyExists = await getPluginService('pathService').findByPath(data.url_path + extension, id);

      if (pathAllreadyExists) {
        await duplicateCheck(ext + 1);
      } else {
        data.url_path = data.url_path + extension;
      }
    };

    await duplicateCheck();

    const pathEntity = await strapi.entityService.update('plugin::webtools.path', id, {
      data,
    });

    return pathEntity;
  },

  /**
   * Delete.
   *
   * @param {number} id the id.
   * @returns {void}
   */
  delete: async (id) => {
    await strapi.entityService.delete('plugin::webtools.path', id);
  },
});
