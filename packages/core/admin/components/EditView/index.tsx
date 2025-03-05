import React from 'react';
import { useQuery } from 'react-query';
import { unstable_useContentManagerContext, Page, useFetchClient } from '@strapi/strapi/admin';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { isContentTypeEnabled } from '../../../server/util/enabledContentTypes';
import { UrlAliasEntity } from '../../types/url-aliases';
import pluginPermissions from '../../permissions';

const EditView = () => {
  const { get } = useFetchClient();
  const context = unstable_useContentManagerContext();
  const {
    contentType,
    model,
    id,
  } = context;

  const aliases = useQuery(`aliases-${model}-${id}`, async () => get<UrlAliasEntity[]>(`/webtools/url-alias/findFrom?model=${model}&documentId=${id}`));

  if (aliases.isLoading) return null;
  if (aliases.error) return null;

  // const i18nLang = new URLSearchParams(window.location.search).get('plugins[i18n][locale]');

  // useEffect(() => {
  //   // Early return for when the i18n plugin is not enabled.
  //   if (!i18nLang) return;

  //   // Map through all url_aliases and clear those that do not match the current i18n language
  //   // If the URL alias is not the same language as the entity,
  //   // we should clear it. This happens when you're copying content
  //   // from a different locale.
  //   const updatedUrlAliases = modifiedDataUrlAliases?.map((alias) => {
  //     if (alias?.locale !== i18nLang) {
  //       return { ...alias, locale: null }; // Clear the alias if the locale doesn't match
  //     }
  //     return alias;
  //   });

  //   // If the URL aliases have changed, update the form data
  //   // We fire the onChange here because we don't want unnecessary re-renders
  //   if (JSON.stringify(updatedUrlAliases) !== JSON.stringify(modifiedDataUrlAliases)) {
  //     onChange('url_alias', updatedUrlAliases);
  //   }
  // }, [modifiedDataUrlAliases, onChange, i18nLang]);

  // @ts-ignore
  if (!isContentTypeEnabled(contentType)) return null;

  return (
    <Page.Protect permissions={pluginPermissions['edit-view.sidebar']}>
      <EditForm />
      {aliases.data.data.length === 0 && (
        <div>Save the form to generate the URL alias</div>
      )}
      {aliases.data.data.length > 0 && (
        <Permalink
          path={aliases.data.data[0].url_path}
        />
      )}
    </Page.Protect>
  );
};

export default EditView;
