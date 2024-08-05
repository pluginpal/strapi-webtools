import _ from 'lodash';
import { EntityService, Schema } from '@strapi/strapi';
import { Common } from '@strapi/types';
import { getPluginService } from '../../util/getPluginService';

export default () => ({
  /**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
  create: async (data: EntityService.Params.Pick<'plugin::webtools.url-pattern', 'data'>['data']) => {
    console.log('Create function called with data:', data);
    const formattedData = data;

    if (data.code) {
      formattedData.code = _.snakeCase(_.deburr(_.toLower(data.code)));
    } else {
      formattedData.code = _.snakeCase(_.deburr(_.toLower(data.label)));
    }

    const patternEntity = await strapi.entityService.create('plugin::webtools.url-pattern', {
      data,
    });
    console.log('Pattern entity created:', patternEntity);

    return patternEntity;
  },
  /**
   * FindOne.
   *
   * @param {number} id the id.
   * @returns {void}
   */
  findOne: async (id: number) => {
    console.log('FindOne function called with id:', id);
    const patternEntity = await strapi.entityService.findOne('plugin::webtools.url-pattern', id);
    console.log('Pattern entity found:', patternEntity);
    return patternEntity;
  },
  /**
   * FindByUid.
   *
   * @param {string} uid the uid.
   * @param {string} langcode the langcode.
   */
  findByUid: async (uid: string, langcode?: string): Promise<string[]> => {
    console.log('FindByUid function called with uid:', uid, 'langcode:', langcode);
    let patterns = await getPluginService('urlPatternService').findMany({
      filters: {
        contenttype: uid,
      },
    });
    console.log('Patterns found:', patterns);

    if (langcode) {
      patterns = patterns.filter((pattern) => (pattern.languages as string).includes(langcode));
      console.log('Patterns filtered by langcode:', patterns);
    }

    if (! patterns.length) {
      console.log('No patterns found, returning default pattern.');
      return [strapi.config.get('plugin.webtools.default_pattern')];
    }

    const patterns2 = patterns.map((pattern) => pattern.pattern);
    console.log('Mapped patterns:', patterns2);

    return patterns2;
  },
  /**
   * FindMany.
   *
   * @param {object} params the params.
   * @returns {void}
   */
  findMany: async (params: any) => {
    console.log('FindMany function called with params:', params);
    const patternEntities = await strapi.entityService.findMany('plugin::webtools.url-pattern', params);
    console.log('Pattern entities found:', patternEntities);
    return patternEntities;
  },
  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {object} data the data.
   * @returns {void}
   */
  update: async (id: number, data: EntityService.Params.Pick<'plugin::webtools.url-pattern', 'data'>['data']) => {
    console.log('Update function called with id:', id, 'data:', data);
    const patternEntity = await strapi.entityService.update('plugin::webtools.url-pattern', id, { data });
    console.log('Pattern entity updated:', patternEntity);
    return patternEntity;
  },
  /**
   * Delete.
   *
   * @param {number} id the id.
   * @returns {void}
   */
  delete: async (id: number) => {
    console.log('Delete function called with id:', id);
    await strapi.entityService.delete('plugin::webtools.url-pattern', id);
    console.log('Pattern entity deleted with id:', id);
  },
  /**
   * Get all field names allowed in the URL of a given content type.
   *
   * @param {string} contentType - The content type.
   * @param {array} allowedFields - Override the allowed fields.
   *
   * @returns {string[]} The fields.
   */
  getAllowedFields: (contentType: Schema.ContentType, allowedFields: string[] = []) => {
    console.log('GetAllowedFields function called with contentType:', contentType, 'allowedFields:', allowedFields);
    const fields: string[] = [];
    allowedFields.forEach((fieldType) => {
      Object.entries(contentType.attributes).forEach(([fieldName, field]) => {
        if ((field.type === fieldType || fieldName === fieldType) && field.type !== 'relation' && fieldName !== 'url_path_id') {
          fields.push(fieldName);
        } else if (
          field.type === 'relation'
          && field.relation.endsWith('ToOne')
          && fieldName !== 'localizations'
          && fieldName !== 'createdBy'
          && fieldName !== 'updatedBy'
        ) {
          // @ts-ignore
          const relation = strapi.contentTypes[field.target];

          if (allowedFields.includes('id') && ! fields.includes(`${fieldName}.id`)) {
            fields.push(`${fieldName}.id`);
          }

          Object.entries(relation.attributes).forEach(([subFieldName, subField]) => {
            if (subField.type === fieldType || subFieldName === fieldType) {
              fields.push(`${fieldName}.${subFieldName}`);
            }
          });
        } else if (
          field.type === 'component'
          && field.component
          && field.repeatable !== true
        ) {
          const relation = strapi.components[field.component];

          if (allowedFields.includes('id') && ! fields.includes(`${fieldName}.id`)) {
            fields.push(`${fieldName}.id`);
          }

          Object.entries(relation.attributes).forEach(([subFieldName, subField]) => {
            if (subField.type === fieldType || subFieldName === fieldType) {
              fields.push(`${fieldName}.${subFieldName}`);
            }
          });
        }
      });
    });

    if (allowedFields.includes('id')) {
      fields.push('id');
    }

    if (allowedFields.includes('pluralName')) {
      fields.push('pluralName');
    }

    console.log('Allowed fields:', fields);
    return fields;
  },
  /**
   * Get all fields from a pattern.
   *
   * @param {string} pattern - The pattern.
   *
   * @returns {array} The fields.\[([\w\d\[\]]+)\]
   */
  getFieldsFromPattern: (patterns: string | string[]) => {
    console.log('GetFieldsFromPattern function called with patterns:', patterns);

    // Zorg ervoor dat patterns een array is
    if (typeof patterns === 'string') {
      // eslint-disable-next-line no-param-reassign
      patterns = [patterns];
    }

    // Voeg alle patronen samen tot een enkele string om de reguliere expressie toe te passen
    const patternString = patterns.join(',');
    console.log('Combined patterns into string:', patternString);

    const fields = patternString.match(/[[\w\d.]+]/g);
    console.log('Fields found in pattern:', fields);

    if (! fields) {
      return [];
    }

    const newFields = fields.map((field) => (/(?<=\[)(.*?)(?=\])/).exec(field)?.[0] ?? '');
    console.log('New fields extracted from pattern:', newFields);

    return newFields;
  },
  /**
   * Get all relations from a pattern.
   *
   *
   * @returns {array} The relations.
   */
  getRelationsFromPattern: (patterns: any) => {
    console.log('GetRelationsFromPattern function called with patterns:', patterns);

    let fields = getPluginService('urlPatternService').getFieldsFromPattern(patterns);
    console.log('Fields extracted for relations:', fields);

    // Filter on fields containing a dot (.)
    fields = fields.filter((field) => field.split('.').length > 1);
    // Extract the first part of the fields
    fields = fields.map((field) => field.split('.')[0]);
    console.log('Relations extracted from fields:', fields);

    return fields;
  },
  /**
   * Resolve a pattern string from pattern to path for a single entity.
   *
   * @param {string} uid - The UID.
   * @param {object} entity - The entity.
   * @param {string} urlPattern - The URL pattern.
   *
   * @returns {string} The path.
   */
  resolvePattern: (
    uid: Common.UID.ContentType,
    entity: { [key: string]: string | number | Date },
    urlPattern: string | string[],
  ) => {
    console.log('ResolvePattern function called with uid:', uid, 'entity:', entity, 'urlPattern:', urlPattern);

    if (typeof urlPattern === 'string') {
      // eslint-disable-next-line no-param-reassign
      urlPattern = [urlPattern];
    }

    const resolve = (pattern: string) => {
      let resolvedPattern: string = pattern;
      const fields = getPluginService('urlPatternService').getFieldsFromPattern([pattern]);

      fields.forEach((field) => {
        const relationalField = field.split('.').length > 1 ? field.split('.') : null;

        if (field === 'pluralName') {
          const fieldValue = strapi.contentTypes[uid].info.pluralName;

          if (! fieldValue) {
            return;
          }

          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else if (! relationalField) {
          const fieldValue = _.kebabCase(_.deburr(_.toLower(String(entity[field]))));
          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else if (Array.isArray(entity[relationalField[0]])) {
          strapi.log.error('Something went wrong whilst resolving the pattern.');
        } else if (typeof entity[relationalField[0]] === 'object') {
          resolvedPattern = resolvedPattern.replace(`[${field}]`, entity[relationalField[0]] && String(entity[relationalField[0]][relationalField[1]]) ? String(entity[relationalField[0]][relationalField[1]]) : '');
        }
      });

      resolvedPattern = resolvedPattern.replace(/([^:]\/)\/+/g, '$1');
      resolvedPattern = resolvedPattern.startsWith('/') ? resolvedPattern : `/${resolvedPattern}`;
      console.log('Resolved pattern:', resolvedPattern);
      return resolvedPattern;
    };

    // Gebruik de map-functie om elk patroon in de array op te lossen
    const resolvedPaths = urlPattern.map((pattern) => resolve(pattern));
    console.log('Resolved paths:', resolvedPaths);
    return resolvedPaths;
  },
  /**
   * Validate if a pattern is correctly structured.
   *
   * @param {string} pattern - The pattern.
   * @param {array} allowedFieldNames - Fields allowed in this pattern.
   *
   * @returns {object} object.
   * @returns {boolean} object.valid Validation boolean.
   * @returns {string} object.message Validation string.
   */
  validatePattern: (pattern: string, allowedFieldNames: string[]) => {
    console.log('ValidatePattern function called with pattern:', pattern, 'allowedFieldNames:', allowedFieldNames);
    if (! pattern) {
      return {
        valid: false,
        message: 'Pattern can not be empty',
      };
    }

    const preCharCount = pattern.split('[').length - 1;
    const postCharount = pattern.split(']').length - 1;

    if (preCharCount < 1 || postCharount < 1) {
      return {
        valid: false,
        message: 'Pattern should contain at least one field',
      };
    }

    if (preCharCount !== postCharount) {
      return {
        valid: false,
        message: 'Fields in the pattern are not escaped correctly',
      };
    }

    let fieldsAreAllowed = true;

    getPluginService('urlPatternService').getFieldsFromPattern(pattern).forEach((field) => {
      if (! allowedFieldNames.includes(field)) fieldsAreAllowed = false;
    });

    if (! fieldsAreAllowed) {
      return {
        valid: false,
        message: 'Pattern contains forbidden fields',
      };
    }

    return {
      valid: true,
      message: 'Valid pattern',
    };
  },
});
