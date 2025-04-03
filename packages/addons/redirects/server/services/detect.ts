import { Modules } from '@strapi/strapi';

type Redirect = Modules.Documents.Document<'plugin::webtools-addon-redirects.redirect'>;

const detectLoop = async (redirect: Redirect): Promise<boolean> => {
  let loop = false;

  const findNextRedirectInChain = async (to: string) => {
    const chainedRedirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
      filters: {
        from: to,
      },
    });

    if (!chainedRedirect) {
      return;
    }

    if (chainedRedirect.to === redirect.from) {
      loop = true;
      return;
    }

    await findNextRedirectInChain(chainedRedirect.to);
  };

  await findNextRedirectInChain(redirect.to);

  return loop;
};

const detectChain = async (redirect: Redirect): Promise<boolean> => {
  const chainedRedirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').findFirst({
    filters: {
      $or: [
        { to: redirect.from },
        { from: redirect.to },
      ],
    },
  });

  if (!chainedRedirect) {
    return false;
  }

  return true;
};

export default () => ({
  chain: detectChain,
  loop: detectLoop,
});
