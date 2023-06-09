'use strict';

import _ from 'lodash';

import { getPluginService } from '../../util/getPluginService';


export default () => ({
  /**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
  create: async (data) => {
    if (data.code) {
      data.code = _.snakeCase(_.deburr(_.toLower(data.code)));
    } else {
      data.code = _.snakeCase(_.deburr(_.toLower(data.label)));
    }

    const patternEntity = await strapi.entityService.create('plugin::url-alias.pattern', {
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
   findOne: async (id) => {
    const patternEntity = await strapi.entityService.findOne('plugin::url-alias.pattern', id);

    return patternEntity;
  },

  /**
   * FindMany.
   *
   * @param {object} params the params.
   * @returns {void}
   */
   findMany: async (params) => {
    const patternEntities = await strapi.entityService.findMany('plugin::url-alias.pattern', params);

    return patternEntities;
  },

  /**
   * Update.
   *
   * @param {number} id the id.
   * @param {object} data the data.
   * @returns {void}
   */
   update: async (id, data) => {
    const patternEntity = await strapi.entityService.update('plugin::url-alias.pattern', id, {
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
   delete: async (id) => {
    await strapi.entityService.delete('plugin::url-alias.pattern', id);
  },

  /**
   * Get all field names allowed in the URL of a given content type.
   *
   * @param {string} contentType - The content type.
   * @param {array} allowedFields - Override the allowed fields.
   *
   * @returns {string[]} The fields.
   */
  getAllowedFields: (contentType, allowedFields: string[] = []) => {
    const fields: string[] = [];
    allowedFields.map((fieldType) => {
      Object.entries(contentType.attributes).map(([fieldName, field]: [string, any]) => {
        if ((field.type === fieldType || fieldName === fieldType) && field.type !== 'relation' && fieldName !== 'url_path_id') {
          fields.push(fieldName);
        } else if (
          field.type === 'relation'
          && field.target
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
    let fields = pattern.match(/[[\w\d.]+]/g); // Get all substrings between [] as array.
    if (!fields) return [];
    fields = fields.map((field) => (/(?<=\[)(.*?)(?=\])/).exec(field)?.[0] ?? ''); // Strip [] from string.
    return fields;
  },

  /**
   * Resolve a pattern string from pattern to path for a single entity.
   *
   * @param {string} uid - The UID.
   * @param {object} entity - The entity.
   *
   * @returns {string} The path.
   */

  resolvePattern: async (uid, entity) => {
    const resolve = (pattern) => {
      const fields = getPluginService('patternService').getFieldsFromPattern(pattern);

      fields.map((field) => {
        const relationalField = field.split('.').length > 1 ? field.split('.') : null;

        // TODO: Relation fields.
          if (!relationalField) {
            // Slugify.
            const fieldValue = _.kebabCase(_.deburr(_.toLower(entity[field])));
            pattern = pattern.replace(`[${field}]`, fieldValue || '');
          } else if (Array.isArray(entity[relationalField[0]])) {
            strapi.log.error('Something went wrong whilst resolving the pattern.');
          } else if (typeof entity[relationalField[0]] === 'object') {
            pattern = pattern.replace(`[${field}]`, entity[relationalField[0]] && entity[relationalField[0]][relationalField[1]] ? entity[relationalField[0]][relationalField[1]] : '');
          }
      });

      pattern = pattern.replace(/([^:]\/)\/+/g, "$1"); // Remove duplicate forward slashes.
      pattern = pattern.startsWith('/') ? pattern : `/${pattern}`; // Add a starting slash.
      return pattern;
    };

    const patterns = await getPluginService('patternService').findMany({
      filters: {
        contenttype: uid,
      },
      limit: 1,
    });

    if (!patterns[0]) {
      return '';
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
  validatePattern: async (pattern, allowedFieldNames) => {
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

    getPluginService('patternService').getFieldsFromPattern(pattern).map((field) => {
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
