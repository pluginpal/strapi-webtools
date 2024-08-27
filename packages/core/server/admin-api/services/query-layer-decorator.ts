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
    let urlAliasEntity: Attribute.GetValues<'plugin::webtools.url-alias', Attribute.GetNonPopulatableKeys<'plugin::webtools.url-alias'>> | null = null;

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.create.call(this, uid, opts);
    }

    // Fetch the URL pattern for this content type.
    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      languages = [];
      const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
      languages = locales.map((locale) => locale.code);
    }

    await Promise.all(languages.map(async (lang) => {
      const urlPatterns = await getPluginService('urlPatternService').findByUid(uid, lang);
      const languageRelations = urlPatterns.flatMap((urlPattern) => getPluginService('urlPatternService').getRelationsFromPattern(urlPattern));
      relations = [...relations, ...languageRelations];
    }));

    if (opts.data.url_alias) {
      urlAliasEntity = await getPluginService('urlAliasService').findOne(opts.data.url_alias);
    }

    // If a URL alias was created and 'generated' is set to false, do nothing.
    if (urlAliasEntity?.generated === false) {
      return service.create.call(this, uid, opts);
    }

    const newEntity = await service.create.call(this, uid, {
      ...opts,
      data: opts.data,
      populate: {
        ...opts.populate,
        ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
        localizations: {
          populate: {
            url_alias: {
              fields: ['id'],
            },
          },
        },
      },
    });

    const urlAliasLocalizations = newEntity.localizations
      ?.map((loc) => loc.url_alias.id)
      ?.filter((loc) => loc) || [];

    const newEntityWithoutLocalizations = {
      ...newEntity,
      localizations: undefined,
    };

    const combinedEntity = { ...newEntityWithoutLocalizations };
    const urlPatterns = await getPluginService('urlPatternService').findByUid(uid, combinedEntity.locale);

    await Promise.all(urlPatterns.map(async (urlPattern) => {
      const generatedPath = getPluginService('urlPatternService').resolvePattern(uid, combinedEntity, urlPattern);

      if (urlAliasEntity?.generated === true) {
        urlAliasEntity = await getPluginService('urlAliasService').update(urlAliasEntity.id, {
          // @ts-ignore
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          // @ts-ignore
          locale: combinedEntity.locale,
          localizations: urlAliasLocalizations,
        });
      } else {
        urlAliasEntity = await getPluginService('urlAliasService').create({
          // @ts-ignore
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          // @ts-ignore
          locale: combinedEntity.locale,
          localizations: urlAliasLocalizations,
        });
      }
    }));

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
    let urlAliasEntity: Attribute.GetValues<'plugin::webtools.url-alias', Attribute.GetNonPopulatableKeys<'plugin::webtools.url-alias'>> | null = null;

    // If Webtools isn't enabled, do nothing.
    if (!hasWT) {
      return service.update.call(this, uid, entityId, opts);
    }

    // Fetch the URL pattern for this content type.
    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      languages = [];
      const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
      languages = locales.map((locale) => locale.code);
    }

    await Promise.all(languages.map(async (lang) => {
      const urlPatterns = await getPluginService('urlPatternService').findByUid(uid, lang);
      const languageRelations = urlPatterns.flatMap((urlPattern) => getPluginService('urlPatternService').getRelationsFromPattern([urlPattern]));
      relations = [...relations, ...languageRelations];
    }));

    // Manually fetch the entity that's being updated.
    const entity = await service.update.call(this, uid, entityId, {
      ...opts,
      populate: {
        ...relations.reduce((obj, key) => ({ ...obj, [key]: {} }), {}),
        url_alias: {
          fields: ['id', 'generated'],
        },
        localizations: {
          populate: {
            url_alias: {
              fields: ['id'],
            },
          },
        },
      },
    });

    // Fetch the URL alias localizations.
    const urlAliasLocalizations = entity.localizations
      ?.map((loc) => loc.url_alias?.id)
      ?.filter((loc) => loc) || [];

    const entityWithoutLocalizations = {
      ...entity,
      localizations: undefined,
    };

    // If a URL alias is already present, fetch it.
    if (opts.data.url_alias) {
      urlAliasEntity = await getPluginService('urlAliasService').findOne(opts.data.url_alias);
      // @ts-ignore
    } else if (entity?.url_alias) {
      // @ts-ignore
      urlAliasEntity = entity.url_alias;
    }

    // If a URL alias is present and 'generated' is set to false, do nothing.
    if (urlAliasEntity?.generated === false) {
      return service.update.call(this, uid, entityId, opts);
    }

    // Generate the path.
    const urlPatterns = await getPluginService('urlPatternService').findByUid(uid, entity.locale);

    await Promise.all(urlPatterns.map(async (urlPattern) => {
      const generatedPath = getPluginService('urlPatternService').resolvePattern(uid, entityWithoutLocalizations, urlPattern);
      if (urlAliasEntity?.generated === true) {
        // If a URL alias is present and 'generated' is set to true, update the alias.
        urlAliasEntity = await getPluginService('urlAliasService').update(urlAliasEntity.id, {
          // @ts-ignore
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          // @ts-ignore
          locale: entity.locale,
          localizations: urlAliasLocalizations,
        });
      } else {
        // If no URL alias is present, create one.
        urlAliasEntity = await getPluginService('urlAliasService').create({
          // @ts-ignore
          url_path: generatedPath,
          generated: true,
          contenttype: uid,
          // @ts-ignore
          locale: entity.locale,
          localizations: urlAliasLocalizations,
        });
      }
    }));

    // Eventually update the entity.
    const updatedEntity = await service.update.call(this, uid, entityId, {
      ...opts,
      data: {
        ...opts.data,
        url_alias: urlAliasEntity.id,
      },
    });

    return updatedEntity;
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
});

export default () => ({
  decorator,
});
