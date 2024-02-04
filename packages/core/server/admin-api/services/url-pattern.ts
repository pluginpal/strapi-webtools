

import _ from 'lodash';
import { EntityService, Schema } from '@strapi/strapi';

import { getPluginService } from '../../util/getPluginService';


export default () => ({
  /**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
  create: async (data: EntityService.Params.Pick<'plugin::webtools.url-pattern', 'data'>['data']) => {
    const formattedData = data;

    if (data.code) {
      formattedData.code = _.snakeCase(_.deburr(_.toLower(data.code)));
    } else {
      formattedData.code = _.snakeCase(_.deburr(_.toLower(data.label)));
    }

    const patternEntity = await strapi.entityService.create('plugin::webtools.url-pattern', {
      data,
    });

    return patternEntity;
  },

  /**
   * FindOne.
   *
   * @param {number} id the id.
   * @returns {void}
   */
  findOne: async (id: number) => {
    const patternEntity = await strapi.entityService.findOne('plugin::webtools.url-pattern', id);

    return patternEntity;
  },

  /**
   * FindMany.
   *
   * @param {object} params the params.
   * @returns {void}
   */
  findMany: async (params) => {
    const patternEntities = await strapi.entityService.findMany('plugin::webtools.url-pattern', params);

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
    const patternEntity = await strapi.entityService.update('plugin::webtools.url-pattern', id, {
      data,
    });

    return patternEntity;
  },

  /**
   * Delete.
   *
   * @param {number} id the id.
   * @returns {void}
   */
  delete: async (id: number) => {
    await strapi.entityService.delete('plugin::webtools.url-pattern', id);
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
    const fields: string[] = [];
    allowedFields.forEach((fieldType) => {
      Object.entries(contentType.attributes).forEach(([fieldName, field]) => {
        if ((field.type === fieldType || fieldName === fieldType) && field.type !== 'relation' && fieldName !== 'url_path_id') {
          fields.push(fieldName);
        } else if (
          field.type === 'relation'
          && field.relation.endsWith('ToOne') // TODO: implement `ToMany` relations.
          && fieldName !== 'localizations'
          && fieldName !== 'createdBy'
          && fieldName !== 'updatedBy'
        ) {
          // TODO: Relation fields.
          // const relation = strapi.contentTypes[field.target];

          // if (
          //   allowedFields.includes('id')
          //   && !fields.includes(`${fieldName}.id`)
          // ) {
          //   fields.push(`${fieldName}.id`);
          // }

          // Object.entries(relation.attributes).map(([subFieldName, subField]) => {
          //   if (subField.type === fieldType || subFieldName === fieldType) {
          //     fields.push(`${fieldName}.${subFieldName}`);
          //   }
          // });
        }
      });
    });

    // Add id field manually because it is not on the attributes object of a content type.
    if (allowedFields.includes('id')) {
      fields.push('id');
    }

    if (allowedFields.includes('pluralName')) {
      fields.push('pluralName');
    }

    return fields;
  },


  /**
   * Get all fields from a pattern.
   *
   * @param {string} pattern - The pattern.
   *
   * @returns {array} The fields.\[([\w\d\[\]]+)\]
   */
  getFieldsFromPattern: (pattern: string) => {
    const fields = pattern.match(/[[\w\d.]+]/g); // Get all substrings between [] as array.
    if (!fields) return [];
    const newFields = fields.map((field) => (/(?<=\[)(.*?)(?=\])/).exec(field)?.[0] ?? ''); // Strip [] from string.
    return newFields;
  },

  /**
   * Resolve a pattern string from pattern to path for a single entity.
   *
   * @param {string} uid - The UID.
   * @param {object} entity - The entity.
   *
   * @returns {string} The path.
   */

  resolvePattern: async (uid: string, entity: { [key: string]: string | number }) => {
    const resolve = (pattern: string) => {
      let resolvedPattern: string = pattern;
      const fields = getPluginService('urlPatternService').getFieldsFromPattern(pattern);

      fields.forEach((field) => {
        const relationalField = field.split('.').length > 1 ? field.split('.') : null;

        // TODO: Relation fields.
        if (field === 'pluralName') {
          const fieldValue = strapi.contentTypes[uid]?.info?.pluralName;
          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else if (!relationalField) {
          // Slugify.
          const fieldValue = _.kebabCase(_.deburr(_.toLower(String(entity[field]))));
          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else if (Array.isArray(entity[relationalField[0]])) {
          strapi.log.error('Something went wrong whilst resolving the pattern.');
        } else if (typeof entity[relationalField[0]] === 'object') {
          resolvedPattern = resolvedPattern.replace(`[${field}]`, entity[relationalField[0]] && String(entity[relationalField[0]][relationalField[1]]) ? String(entity[relationalField[0]][relationalField[1]]) : '');
        }
      });

      resolvedPattern = resolvedPattern.replace(/([^:]\/)\/+/g, '$1'); // Remove duplicate forward slashes.
      resolvedPattern = resolvedPattern.startsWith('/') ? resolvedPattern : `/${resolvedPattern}`; // Add a starting slash.
      return resolvedPattern;
    };

    const patterns = await getPluginService('urlPatternService').findMany({
      filters: {
        contenttype: uid,
      },
      limit: 1,
    });

    if (!patterns[0]) {
      return resolve(strapi.config.get('plugin.webtools.default_pattern'));
    }

    const path = resolve(patterns[0].pattern);
    return path;
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
    if (!pattern) {
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
      if (!allowedFieldNames.includes(field)) fieldsAreAllowed = false;
    });

    if (!fieldsAreAllowed) {
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
