'use strict';

import { isContentTypeEnabled } from '../../util/enabledContentTypes';
import { getPluginService } from '../../util/getPluginService';

/**
 * Decorates the entity service with WT business logic
 * @param {object} service - entity service
 */
const decorator = (service) => ({
  async create(uid, opts: any = {}) {
    const hasWT = isContentTypeEnabled(uid);
    let urlAliasEntity;

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.create.call(this, uid, opts);
    }

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
    const generatedPath = await getPluginService('urlPatternService').resolvePattern(uid, { ...opts.data, id: newEntity.id });

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
    const updatedEntity = await service.update.call(this, uid, newEntity.id, { ...opts, data: dataWithUrlAlias });

    return updatedEntity;
  },
  async update(uid, entityId, opts: any = {}) {
    const hasWT = isContentTypeEnabled(uid);
    let urlAliasEntity;

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.update.call(this, uid, entityId, opts);
    }

    // If a URL alias is allready present, fetch it.
    if (opts.data.url_alias) {
      urlAliasEntity = await getPluginService('urlAliasService').findOne(opts.data.url_alias);
    }

    // If a URL alias is present and 'generated' is set to false, do nothing.
    if (urlAliasEntity?.generated === false) {
      return service.update.call(this, uid, entityId, opts);
    }

    // Generate the new path.
    const generatedPath = await getPluginService('urlPatternService').resolvePattern(uid, { ...opts.data, id: entityId });

    // If a URL alias is present and 'generated' is set to true, update the alias.
    if (urlAliasEntity?.generated === true) {
      urlAliasEntity = await getPluginService('urlAliasService').update(urlAliasEntity.id, { url_path: generatedPath, generated: true, contenttype: uid });
    }

    // If no URL alias is present, create one.
    if (!urlAliasEntity) {
      urlAliasEntity = await getPluginService('urlAliasService').create({ url_path: generatedPath, generated: true, contenttype: uid });
    }

    // Eventually update the entity.
    return service.update.call(this, uid, entityId, opts);
  },
  async delete(uid, entityId) {
    const hasWT = isContentTypeEnabled(uid);

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.delete.call(this, uid, entityId);
    }

    // Fetch the entity because we need the url_alias id.
    const entity: any = await strapi.entityService.findOne(uid, entityId, {
      populate: 'url_alias',
    });

    // If a URL alias is present, delete it.
    if (entity.url_alias?.id) {
      await getPluginService('urlAliasService').delete(entity.url_alias.id);
    }

    // Eventually delete the entity.
    return service.delete.call(this, uid, entityId);
  }
});

export default () => ({
  decorator,
});
