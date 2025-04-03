/* eslint-disable no-new */
import { Modules } from '@strapi/strapi';
import { errors, validateYupSchema, yup } from '@strapi/utils';
import { getPluginService } from '../util/getPluginService';

// eslint-disable-next-line max-len
const validationMiddleware: Modules.Documents.Middleware.Middleware = async (context, next) => {
  const { uid, action } = context;

  // Only run this for the redirect entities.
  if (uid !== 'plugin::webtools-addon-redirects.redirect') {
    return next();
  }

  // Run this middleware only for the update & create action.
  if (!['create', 'update'].includes(action)) {
    return next();
  }

  const params = context.params as Modules.Documents.ServiceParams<'plugin::webtools-addon-redirects.redirect'>['update' | 'create'] & { documentId: string };

  const existingRedirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findOne({
    documentId: params.documentId,
  });

  const newRedirect = {
    ...existingRedirect,
    ...params.data,
  } as Modules.Documents.Document<'plugin::webtools-addon-redirects.redirect'>;

  const existingRedirectFromSameLocation = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
    filters: {
      from: params.data.from,
      documentId: {
        $not: params.documentId,
      },
    },
  });

  let toExternalUrl: boolean;
  let fromExternalUrl: boolean;

  try {
    new URL(newRedirect.to);
    toExternalUrl = true;
  } catch {
    toExternalUrl = false;
  }

  try {
    new URL(newRedirect.from);
    fromExternalUrl = true;
  } catch {
    fromExternalUrl = false;
  }

  const validator = yup.object().shape({
    from: yup
      .string()
      .required('The "from" field is required.')
      .test(
        'start-with-slash',
        'The "from" field must start with a leading slash.',
        (value) => fromExternalUrl || !value || value?.startsWith('/'),
      )
      .test(
        'not-external-url',
        'The "from" field must not be an external URL.',
        (value) => {
          try {
            new URL(value || '');
            return false;
          } catch {
            return true;
          }
        },
      )
      .test(
        'unique',
        'A redirect with the same "from" value already exists.',
        () => !existingRedirectFromSameLocation,
      ),
    to: yup
      .string()
      .test(
        'start-with-slash',
        'Internal redirects must start with a leading slash.',
        (value) => toExternalUrl || !value || value?.startsWith('/'),
      )
      .required('The "to" field is required.')
      .notOneOf([yup.ref('from')], 'The "from" and "to" fields cannot be the same.'),
    status_code: yup
      .number()
      .required('The "status_code" field is required.')
      .min(300, 'The "status_code" must be between 300 and 308.')
      .max(308, 'The "status_code" must be between 300 and 308.'),
  });

  /**
   * Simple validations using yup.
   */
  await validateYupSchema(validator, {
    strict: false,
    abortEarly: false,
  })(newRedirect);

  /**
   * Throw error if the redirect would create a loop.
   */
  const loop = await getPluginService('detect').loop(newRedirect);
  if (loop) {
    throw new errors.ValidationError('Creating this redirect would create a loop, please change it.');
  }

  /**
   * Throw error if the redirect would create a chain.
   */
  const chain = await getPluginService('detect').chain(newRedirect);
  if (chain) {
    throw new errors.ValidationError('Creating this redirect would create a chain, please change it.');
  }

  return next();
};

export default validationMiddleware;
