

import { EntityService } from '@strapi/types';
import { getPluginService } from '../../util/getPluginService';

/**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
const create = async (data: EntityService.Params.Pick<'plugin::webtools.url-alias', 'data'>['data']) => {
  let urlPath = String(data.url_path);

  const duplicateCheck = async (ext = -1) => {
    const extension = ext >= 0 ? `-${ext}` : '';
    const pathAllreadyExists = await getPluginService('urlAliasService').findByPath(urlPath + extension);

    if (pathAllreadyExists) {
      await duplicateCheck(ext + 1);
    } else {
      urlPath += extension;
    }
  };

  await duplicateCheck();

  const pathEntity = await strapi.entityService.create('plugin::webtools.url-alias', {
    data,
  });

  return pathEntity;
};

/**
 * findOne.
 *
 * @param {number} id the id.
 * @returns {void}
 */
const findOne = async (id: number | string) => {
  const pathEntity = await strapi.entityService.findOne('plugin::webtools.url-alias', id);

  return pathEntity;
};

/**
 * findMany.
 *
 * @param {boolean} showDrafts wheter to include the drafts.
 * @param {object} query the entity service query.
 * @returns {void}
 */
const findMany = async (showDrafts: boolean = false, query: EntityService.Params.Pick<'plugin::webtools.url-alias', 'fields' | 'populate' | 'pagination' | 'sort' | 'filters' | '_q' | 'publicationState' | 'plugin'> = {}) => {
  const excludeDrafts = false;

  // Check drafAndPublish setting.
  if (!showDrafts) {
    // TODO:
    // Exclude draft URLs.
    // We need to check the publication status of the linked entity.
  }

  const { results, pagination } = await strapi.entityService.findPage('plugin::webtools.url-alias', {
    ...query,
    filters: {
      ...query?.filters,
      published_at: excludeDrafts ? {
        $notNull: true,
      } : {},
    },
  });

  return { results, pagination };
};

/**
 * findByPath.
 *
 * @param {string} path the path.
 * @param {number} id the id to ignore.
 */
const findByPath = async (path: string, id: number | string = 0) => {
  const pathEntity = await strapi.entityService.findMany('plugin::webtools.url-alias', {
    filters: {
      url_path: path,
      id: {
        $not: id,
      },
    },
    limit: 1,
  });

  return pathEntity[0];
};

/**
 * Update.
 *
 * @param {number} id the id.
 * @param {object} data the data.
 * @returns {void}
 */
const update = async (id: number | string, data: EntityService.Params.Pick<'plugin::webtools.url-alias', 'data'>['data']) => {
  let urlPath = String(data.url_path);

  const duplicateCheck = async (ext = -1) => {
    const extension = ext >= 0 ? `-${ext}` : '';
    const pathAllreadyExists = await findByPath(urlPath + extension, id);

    if (pathAllreadyExists) {
      await duplicateCheck(ext + 1);
    } else {
      urlPath += extension;
    }
  };

  await duplicateCheck();

  const pathEntity = await strapi.entityService.update('plugin::webtools.url-alias', id, {
    data,
  });

  return pathEntity;
};

/**
 * Delete.
 *
 * @param {number} id the id.
 * @returns {void}
 */
const deleteUrlAlias = async (id: number | string) => {
  await strapi.entityService.delete('plugin::webtools.url-alias', id);
};

export default () => ({
  create,
  update,
  findOne,
  findMany,
  findByPath,
  delete: deleteUrlAlias,
});
