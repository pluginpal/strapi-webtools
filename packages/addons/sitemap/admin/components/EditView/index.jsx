import React, { useEffect, useState } from 'react';

import { Button } from '@strapi/design-system';
import { CheckCircle, CrossCircle } from '@strapi/icons';
import { unstable_useContentManagerContext, getFetchClient, unstable_useDocument } from '@strapi/strapi/admin';

const CMEditViewExclude = () => {
  const [sitemapSettings, setSitemapSettings] = useState({});
  const { get } = getFetchClient();
  const { form, model, collectionType, id, ...props } = unstable_useContentManagerContext();
  const urlParams = new URLSearchParams(window.location.search);
  const locale = urlParams.get('plugins[i18n][locale]');

  console.log(locale);

  const { document } = unstable_useDocument({
    model,
    collectionType,
    documentId: id,
    // params: {
    //   ...(locale ? { locale } : {}),
    // },
  });
  const { values, onChange } = form;

  useEffect(() => {
    const getSitemapSettings = async () => {
      const settings = await get('/webtools-addon-sitemap/settings/');
      setSitemapSettings(settings.data);
    };

    getSitemapSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!sitemapSettings.contentTypes) return null;
  if (!sitemapSettings.contentTypes[props.slug]) return null;

  const excluded = 'sitemap_exclude' in values ? values.sitemap_exclude : document?.sitemap_exclude;

  return (
    <Button
      size="S"
      width="100%"
      variant={excluded ? 'tertiary' : 'secondary'}
      startIcon={excluded ? <CrossCircle /> : <CheckCircle />}
      onClick={() => {
        onChange('sitemap_exclude', !excluded);
      }}
    >
      {excluded ? 'Excluded from ' : 'Included in '} Sitemap
    </Button>
  );
};

export default CMEditViewExclude;
