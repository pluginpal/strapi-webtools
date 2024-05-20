import { Common, Attribute } from '@strapi/types';
import { IDecoratedService, IDecoratedServiceOptions } from '../../types/strapi';
import { isContentTypeEnabled } from '../../util/enabledContentTypes';
import { getPluginService } from '../../util/getPluginService';

/**
 * Decorates the entity service with WT business logic
 * @param {object} service - entity service
 */
const decorator = (service: IDecoratedService) => ({
  async create(uid: Common.UID.ContentType, opts: IDecoratedServiceOptions<{ url_alias: number }>) {
    const hasWT = isContentTypeEnabled(uid);
    let urlAliasEntity: Attribute.GetValues<'plugin::webtools.url-alias', Attribute.GetNonPopulatableKeys<'plugin::webtools.url-alias'>>;

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.create.call(this, uid, opts);
    }

    // Fetch the URL pattern for this content type.
    const urlPattern = await getPluginService('urlPatternService').findByUid(uid);

    // If a URL alias was created, fetch it.
    if (opts.data.url_alias) {
      urlAliasEntity = await getPluginService('urlAliasService').findOne(opts.data.url_alias);
    }

    // If a URL alias was created and 'generated' is set to false, do nothing.
    if (urlAliasEntity?.generated === false) {
      return service.create.call(this, uid, opts);
    }

    // Ideally here we would create the URL alias an directly fire
    // the `service.create.call` function with the new URL alias id.
    // Though it is possible that the `id` field is used in the URL.
    // In that case we have to create the entity first. Then when we know
    // the id, can we create the URL alias entity and can we update
    // the previously created entity.
    const newEntity = await service.create.call(this, uid, { ...opts, data: opts.data });
    const generatedPath = getPluginService('urlPatternService').resolvePattern(uid, { ...newEntity, ...opts.data }, urlPattern);

    // If a URL alias was created and 'generated' is set to true, update the alias.
    if (urlAliasEntity?.generated === true) {
      urlAliasEntity = await getPluginService('urlAliasService').update(urlAliasEntity.id, { url_path: generatedPath, generated: true, contenttype: uid });
    }

    // If no URL alias was created, create one.
    if (!urlAliasEntity) {
      urlAliasEntity = await getPluginService('urlAliasService').create({ url_path: generatedPath, generated: true, contenttype: uid });
    }

    // Eventually update the entity to include the URL alias.
    const dataWithUrlAlias = { ...opts.data, url_alias: urlAliasEntity.id };
    const updatedEntity = await service.update.call(this, uid, newEntity.id, {
      ...opts, data: dataWithUrlAlias,
    });

    return updatedEntity;
  },
  async update(
    uid: Common.UID.ContentType,
    entityId: number,
    opts: IDecoratedServiceOptions<{ url_alias: number }>,
  ) {
    const hasWT = isContentTypeEnabled(uid);
    let urlAliasEntity: Attribute.GetValues<'plugin::webtools.url-alias', Attribute.GetNonPopulatableKeys<'plugin::webtools.url-alias'>>;

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.update.call(this, uid, entityId, opts);
    }

    // Fetch the URL pattern for this content type.
    const urlPattern = await getPluginService('urlPatternService').findByUid(uid);
    const relations = getPluginService('urlPatternService').getRelationsFromPattern(urlPattern);

    // Manually fetch the entity that's being updated.
    // We do this becuase not all it's data is present in opts.data.
    const entity = await service.findOne.call(this, uid, entityId, {
      populate: {
        ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
        url_alias: {
          fields: ['id', 'generated'],
        },
      },
    });

    // If a URL alias is already present, fetch it.
    if (opts.data.url_alias) {
      urlAliasEntity = await getPluginService('urlAliasService').findOne(opts.data.url_alias);
    } else if (entity.url_alias) {
      urlAliasEntity = entity.url_alias;
    }

    // If a URL alias is present and 'generated' is set to false, do nothing.
    if (urlAliasEntity?.generated === false) {
      return service.update.call(this, uid, entityId, opts);
    }

    // Generate the path.
    const generatedPath = getPluginService('urlPatternService').resolvePattern(uid, entity, urlPattern);

    // If a URL alias is present and 'generated' is set to true, update the alias.
    if (urlAliasEntity?.generated === true) {
      urlAliasEntity = await getPluginService('urlAliasService').update(urlAliasEntity.id, { url_path: generatedPath, generated: true, contenttype: uid });
    }

    // If no URL alias is present, create one.
    if (!urlAliasEntity) {
      urlAliasEntity = await getPluginService('urlAliasService').create({ url_path: generatedPath, generated: true, contenttype: uid });
    }

    // Eventually update the entity.
    return service.update.call(this, uid, entityId, {
      ...opts,
      data: {
        ...opts.data,
        url_alias: urlAliasEntity.id,
      },
    });
  },
  async delete(uid: Common.UID.ContentType, entityId: number) {
    const hasWT = isContentTypeEnabled(uid);

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.delete.call(this, uid, entityId);
    }

    // Fetch the entity because we need the url_alias id.
    const entity = await service.findOne.call(this, uid, entityId, {
      populate: {
        url_alias: {
          fields: ['id'],
        },
      },
    });

    // If a URL alias is present, delete it.
    if (entity.url_alias?.id) {
      await getPluginService('urlAliasService').delete(entity.url_alias.id);
    }

    // Eventually delete the entity.
    return service.delete.call(this, uid, entityId);
  },

  async clone(
    uid: Common.UID.ContentType, cloneId: number, params?: IDecoratedServiceOptions<{ url_alias: number }>) {
    const hasWT = isContentTypeEnabled(uid);
    if (!hasWT) {
      return service.clone.call(this, uid, cloneId, params);
    }

    // Clone the entity
    const clonedEntity = await service.clone.call(this, uid, cloneId, params);

    // Handle URL alias for the cloned entity
    if (clonedEntity && clonedEntity.url_alias) {
      const newUrlAlias = await getPluginService('urlAliasService').create({
        url_path: `${clonedEntity.url_alias.url_path}-clone`,
        generated: true,
        contenttype: uid
      });

      // Update the cloned entity with the new URL alias id
      await service.update.call(this, uid, clonedEntity.id, { data: { url_alias: newUrlAlias.id } });
    }

    return clonedEntity;
  },

  async deleteMany(uid: Common.UID.ContentType, params: any) {
    const hasWT = isContentTypeEnabled(uid);
    if (!hasWT) {
      return service.deleteMany.call(this, uid, params);
    }

    // Find entities matching the criteria to delete their URL aliases
    const entitiesToDelete = await strapi.entityService.findMany(uid, { ...params, fields: ['id'], populate: ['url_alias'] });
    for (const entity of entitiesToDelete) {
      if (entity.url_alias) {
        await getPluginService('urlAliasService').delete(entity.url_alias.id);
      }
    }

    // Delete the entities after URL aliases
    return strapi.entityService.deleteMany(uid, params);
  },
});

export default () => ({
  decorator,
});
