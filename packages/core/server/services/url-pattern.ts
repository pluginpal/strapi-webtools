import { factories, Schema, UID } from '@strapi/strapi';
import { getPluginService } from '../util/getPluginService';
import { typedEntries } from '../util/typeHelpers';
import { Config } from '../config';

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
      return [strapi.config.get('plugin::webtools.default_pattern')];
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
          && fieldName !== 'localizations'
          && fieldName !== 'createdBy'
          && fieldName !== 'updatedBy'
        ) {
          // @ts-expect-error
          // field.target is not strongly typed in the Strapi Attribute types.
          const relation = strapi.contentTypes[field.target as UID.ContentType];

          if (allowedFields.includes('documentId') && !fields.includes(`${fieldName}.documentId`)) {
            fields.push(`${fieldName}.documentId`);
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

          if (allowedFields.includes('documentId') && !fields.includes(`${fieldName}.documentId`)) {
            fields.push(`${fieldName}.documentId`);
          }

          Object.entries(relation.attributes).forEach(([subFieldName, subField]) => {
            if (subField.type === fieldType || subFieldName === fieldType) {
              fields.push(`${fieldName}.${subFieldName}`);
            }
          });
        }
      });
    });

    // Add documentId field manually because it is not on the attributes object of a content type.
    if (allowedFields.includes('documentId')) {
      fields.push('documentId');
    }

    if (allowedFields.includes('pluralName')) {
      fields.push('pluralName');
    }

    return fields;
  },

  /**
   * Get all fields from a pattern.
   *
   * @param {string} pattern - The patterns to extract fields from.
   * @returns {string[]} The extracted fields.
   */
  getFieldsFromPattern: (pattern: string): string[] => {
    const fields = pattern.match(/\[[\w\d.\-[\]]+\]/g); // Get all substrings between [] as array.

    if (!fields) {
      return [];
    }

    const newFields = fields.map((field) => field.slice(1, -1)); // Strip [] from string.

    return newFields;
  },

  /**
   * Get all relations from a pattern.
   *
   * @param {string} pattern - The patterns to extract relations from.
   * @returns {string[]} The extracted relations.
   */
  getRelationsFromPattern: (pattern: string): string[] => {
    // Get fields from the pattern (assuming they are inside square brackets)
    let fields = getPluginService('url-pattern').getFieldsFromPattern(pattern);

    // Filter out fields that are empty or malformed
    fields = fields.filter((field) => field);

    // For fields containing dots, extract the first part (relation)
    const relations = fields
      .filter((field) => field.includes('.'))
      .map((field) => field.split('.')[0])
      .map((relation) => relation.replace(/\[\d+\]/g, '')); // Strip array index

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
    entity: { [key: string]: any },
    urlPattern?: string,
  ): string => {
    const resolve = (pattern: string) => {
      let resolvedPattern: string = pattern;

      const fields = getPluginService('url-pattern').getFieldsFromPattern(
        pattern,
      );

      fields.forEach((field) => {
        const relationalField = field.split('.').length > 1 ? field.split('.') : null;
        const { slugify } = strapi.config.get<Config>('plugin::webtools');

        if (field === 'pluralName') {
          const fieldValue = strapi.contentTypes[uid].info.pluralName;

          if (!fieldValue) {
            return;
          }

          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else if (!relationalField) {
          const fieldValue = slugify(String(entity[field]));
          resolvedPattern = resolvedPattern.replace(`[${field}]`, fieldValue || '');
        } else {
          let relationName = relationalField[0];
          let relationIndex: number | null = null;

          const arrayMatch = relationName.match(/^([\w-]+)\[(\d+)\]$/);
          if (arrayMatch) {
            const [, name, index] = arrayMatch;
            relationName = name;
            relationIndex = parseInt(index, 10);
          }

          const relationEntity = entity[relationName];

          if (Array.isArray(relationEntity) && relationIndex !== null) {
            const subEntity = relationEntity[relationIndex];
            const value = subEntity?.[relationalField[1]];
            resolvedPattern = resolvedPattern.replace(`[${field}]`, value ? slugify(String(value)) : '');
          } else if (typeof relationEntity === 'object' && !Array.isArray(relationEntity)) {
            const value = relationEntity?.[relationalField[1]];
            resolvedPattern = resolvedPattern.replace(`[${field}]`, value ? slugify(String(value)) : '');
          } else {
            strapi.log.error('Something went wrong whilst resolving the pattern.');
          }
        }
      });

      resolvedPattern = resolvedPattern.replace(/\/+/g, '/'); // Remove duplicate forward slashes.
      resolvedPattern = resolvedPattern.startsWith('/') ? resolvedPattern : `/${resolvedPattern}`; // Add a starting slash.
      return resolvedPattern;
    };

    if (!urlPattern) {
      return resolve(strapi.config.get('plugin::webtools.default_pattern'));
    }

    const path = resolve(urlPattern);
    return path;
  },

  /**
   * Validate if a pattern is correctly structured.
   *
   * @param {string} pattern - The pattern to validate.
   * @param {string[]} allowedFieldNames - The allowed fields.
   * @param {Schema.ContentType} contentType - The content type.
   * @returns {object} The validation result.
   */
  validatePattern: (
    pattern: string,
    allowedFieldNames: string[],
    contentType?: Schema.ContentType,
  ): { valid: boolean, message: string } => {
    if (!pattern) {
      return {
        valid: false,
        message: 'Pattern cannot be empty',
      };
    }

    const fields = getPluginService('url-pattern').getFieldsFromPattern(pattern);
    let valid = true;
    let message = '';

    fields.forEach((field) => {
      // Check if the field is allowed.
      // We strip the array index from the field name to check if it is allowed.
      // e.g. private_categories[0].slug -> private_categories.slug
      const fieldName = field.replace(/\[\d+\]/g, '');
      if (!allowedFieldNames.includes(fieldName)) {
        valid = false;
        message = `Pattern contains forbidden fields: ${field}`;
      }

      // Check if the field is a ToMany relation and has an array index.
      if (contentType && field.includes('.')) {
        const [relationName] = field.split('.');
        // Strip array index to get the attribute name
        const attributeName = relationName.replace(/\[\d+\]/g, '');
        const attribute = contentType.attributes[attributeName];

        if (
          attribute
          && attribute.type === 'relation'
          && !attribute.relation.endsWith('ToOne')
          && !relationName.includes('[')
        ) {
          valid = false;
          message = `The relation ${attributeName} is a ToMany relation and must include an array index (e.g. ${attributeName}[0]).`;
        }
      }
    });

    return {
      valid,
      message,
    };
  },
});

export default factories.createCoreService(contentTypeSlug, customServices);
