import { Core } from '@strapi/strapi';

import automatedRedirectsMiddleware from './middleware/automated-redirects';
import validationMiddleware from './middleware/validation';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.documents.use(validationMiddleware);
  strapi.documents.use(automatedRedirectsMiddleware);
};
