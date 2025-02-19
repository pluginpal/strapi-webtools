import { factories, Schema, UID } from '@strapi/strapi';
import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';
import kebabCase from 'lodash/kebabCase';
import { getPluginService } from '../util/getPluginService';
import { typedEntries } from '../util/typeHelpers';

const contentTypeSlug = 'plugin::webtools.url-pattern';

const customServices = () => ({
  /**
   * Find URL patterns by UID and optionally language code.
   *
   * @param {string} uid - The UID of the content type.
   * @param {string} langcode - The optional language code.
   * @returns {Promise<string[]>} The array of URL patterns.
   */
  findByUid: async (uid: string, langcode?: string): Promise<string[]> => {
    let patterns = await strapi.documents(contentTypeSlug).findMany({
      filters: {
        contenttype: uid,
      },
    });

    if (langcode) {
      patterns = patterns.filter((pattern) => (pattern.languages as string).includes(langcode));
    }

    if (!patterns.length) {
      return [strapi.config.get('plugin.webtools.default_pattern')];
    }

    const patternsArray = patterns.map((pattern) => pattern.pattern);

    return patternsArray;
  },

  /**
   * Get all field names allowed in the URL of a given content type.
   *
   * @param {string} contentType - The content type.
   * @param {string[]} allowedFields - The allowed fields to include.
   * @returns {string[]} The list of allowed field names.
   */
  getAllowedFields: (contentType: Schema.ContentType, allowedFields: string[] = []) => {
    const fields: string[] = [];
    allowedFields.forEach((fieldType) => {
      typedEntries(contentType.attributes).forEach(([fieldName, field]) => {
        if ((field.type === fieldType || fieldName === fieldType) && field.type !== 'relation') {
          fields.push(fieldName);
        } else if (
          field.type === 'relation'
          && field.relation.endsWith('ToOne') // TODO: implement `ToMany` relations.
          && fieldName !== 'localizations'
          && fieldName !== 'createdBy'
          && fieldName !== 'updatedBy'
        ) {
          // @ts-expect-error
          // field.target is not strongly typed in the Strapi Attribute types.
          const relation = strapi.contentTypes[field.target as UID.ContentType];

          if (allowedFields.includes('id') && !fields.includes(`${fieldName}.id`)) {
            fields.push(`${fieldName}.id`);
          }

          typedEntries(relation.attributes).forEach(([subFieldName, subField]) => {
            if (subField.type === fieldType || subFieldName === fieldType) {
              fields.push(`${fieldName}.${subFieldName}`);
            }
          });
        } else if (
          field.type === 'component'
          && field.component
          && field.repeatable !== true // TODO: implement repeatable components.
        ) {
          const relation = strapi.components[field.component];

          if (allowedFields.includes('id') && !fields.includes(`${fieldName}.id`)) {
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
   * @param {string[]} patterns - The patterns to extract fields from.
   * @returns {string[]} The extracted fields.
   */
  getFieldsFromPattern: (pattern: string) => {
    const fields = pattern.match(/[[\w\d.]+]/g); // Get all substrings between [] as array.

    if (!fields) {
      return [];
    }

    const newFields = fields.map((field) => (/(?<=\[)(.*?)(?=\])/).exec(field)?.[0] ?? ''); // Strip [] from string.

    return newFields;
  },

  /**
   * Get all relations from a pattern.
   *
   * @param {string[]} patterns - The patterns to extract relations from.
   * @returns {string[]} The extracted relations.
   */
  getRelationsFromPattern: (pattern: string) => {
    // Get fields from the pattern (assuming they are inside square brackets)
    let fields = getPluginService('url-pattern').getFieldsFromPattern(pattern);

    // Filter out fields that are empty or malformed
    fields = fields.filter((field) => field);

    // For fields containing dots, extract the first part (relation)
    const relations = fields.filter((field) => field.includes('.')).map((field) => field.split('.')[0]);

    return relations;
  },


  /**
   * Resolve a pattern string from pattern to path for a single entity.
   *
   * @param {string} uid - The UID of the content type.
   * @param {object} entity - The entity to resolve the pattern for.
   * @param {string} [urlPattern] - The URL pattern to resolve.
   * @returns {string} The resolved path.
   */
  resolvePattern: (
    uid: UID.ContentType,
    entity: { [key: string]: string | number | Date },
    urlPattern?: string,
  ): string => {
    const resolve = (pattern: string) => {
      let resolvedPattern: string = pattern;

      // Ensure pattern is an array before sending it to getFieldsFromPattern
      const fields = getPluginService('url-pattern').getFieldsFromPattern(
        pattern,
      );

      fields.forEach((field) => {
        const relationalField = field.split('.').length > 1 ? field.split('.') : null;

        if (field === 'pluralName') {
          const fieldValue = strapi.contentTypes[uid].info.pluralName;

          if (!fieldValue) {
            return;
          }

          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else if (!relationalField) {
          // Slugify the field value
          const fieldValue = kebabCase(deburr(toLower(String(entity[field]))));
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

    if (!urlPattern) {
      return resolve(strapi.config.get('plugin.webtools.default_pattern'));
    }

    const path = resolve(urlPattern);
    return path;
  },

  /**
   * Validate if a pattern is correctly structured.
   *
   * @param {string[]} pattern - The pattern to validate.
   * @param {string[]} allowedFieldNames - The allowed field names in the pattern.
   * @returns {object} The validation result.
   * @returns {boolean} object.valid - Validation boolean.
   * @returns {string} object.message - Validation message.
   */
  validatePattern: (pattern: string, allowedFieldNames: string[]) => {
    if (!pattern.length) {
      return {
        valid: false,
        message: 'Pattern cannot be empty',
      };
    }

    const preCharCount = pattern.split('[').length - 1;
    const postCharCount = pattern.split(']').length - 1;

    if (preCharCount < 1 || postCharCount < 1) {
      return {
        valid: false,
        message: 'Pattern should contain at least one field',
      };
    }

    if (preCharCount !== postCharCount) {
      return {
        valid: false,
        message: 'Fields in the pattern are not escaped correctly',
      };
    }

    let fieldsAreAllowed = true;

    // Pass the original `pattern` array to getFieldsFromPattern
    getPluginService('url-pattern').getFieldsFromPattern(pattern).forEach((field) => {
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

export default factories.createCoreService(contentTypeSlug, customServices);
