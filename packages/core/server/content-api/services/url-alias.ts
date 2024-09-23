import { factories } from '@strapi/strapi';

/**
 * URL alias service
 */

const contentTypeSlug = 'plugin::webtools.url-alias';

export default factories.createCoreService(contentTypeSlug);
