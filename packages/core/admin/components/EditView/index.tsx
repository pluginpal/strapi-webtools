import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { SidebarModal } from '@pluginpal/webtools-helper-plugin';
import { useCMEditViewDataManager, CheckPermissions } from '@strapi/helper-plugin';
import getTrad from '../../helpers/getTrad';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { useCreateUrlAlias, useUpdateUrlAlias } from '../../api/url-alias';
import { isContentTypeEnabled } from '../../../server/util/enabledContentTypes';
import { UrlAliasEntity } from '../../types/url-aliases';
import pluginPermissions from '../../permissions';

const EditView = () => {
  const { formatMessage } = useIntl();
  const {
    allLayoutData,
    modifiedData,
    initialData,
    onChange,
    slug,
  } = useCMEditViewDataManager();


  const modifiedDataUrlAliases = modifiedData.url_alias as UrlAliasEntity[];
  const i18nLang = new URLSearchParams(window.location.search).get('plugins[i18n][locale]');

  useEffect(() => {
    // Early return for when the i18n plugin is not enabled.
    if (!i18nLang) return;

    // Map through all url_aliases and clear those that do not match the current i18n language
    // If the URL alias is not the same language as the entity,
    // we should clear it. This happens when you're copying content
    // from a different locale.
    const updatedUrlAliases = modifiedDataUrlAliases?.map((alias) => {
      if (alias?.locale !== i18nLang) {
        return { ...alias, locale: null }; // Clear the alias if the locale doesn't match
      }
      return alias;
    });

    // If the URL aliases have changed, update the form data
    // We fire the onChange here because we don't want unnecessary re-renders
    if (JSON.stringify(updatedUrlAliases) !== JSON.stringify(modifiedDataUrlAliases)) {
      onChange({ target: { name: 'url_alias', value: updatedUrlAliases, type: 'array' } });
    }
  }, [modifiedDataUrlAliases, onChange, i18nLang]);

  const { createUrlAlias } = useCreateUrlAlias();
  const { updateUrlAliases } = useUpdateUrlAlias();

  if (!allLayoutData.contentType) return null;

  if (!isContentTypeEnabled(allLayoutData.contentType)) return null;
  const modifiedUrlAliases = modifiedData.url_alias as UrlAliasEntity[];
  const initialUrlAliases = initialData.url_alias as UrlAliasEntity[];

  const onSubmit = async () => {
    if (!initialUrlAliases || initialUrlAliases?.length === 0) {
      // Create new URL aliases
      const newAliases = await Promise.all(
        modifiedUrlAliases.map(async (alias) => (await createUrlAlias(alias, slug)).data),
      );

      onChange({ target: { name: 'url_alias', value: newAliases, type: 'array' } });
    } else {
      // Update existing URL aliases
      await Promise.all(
        modifiedUrlAliases.map((alias) => updateUrlAliases(alias, slug)),
      );
    }
  };

  return (
    <CheckPermissions permissions={pluginPermissions['edit-view.sidebar']}>
      <SidebarModal
        label={formatMessage({
          id: getTrad('plugin.name'),
          defaultMessage: 'URL alias',
        })}
        onSubmit={onSubmit}
        onCancel={() => {
          if (modifiedUrlAliases?.length > 0) {
            onChange({ target: { name: 'url_alias', value: modifiedUrlAliases, type: 'array' } });
          } else if (initialUrlAliases?.length > 0) {
            onChange({ target: { name: 'url_alias', value: initialUrlAliases, type: 'array' } });
          } else {
            onChange({ target: { name: 'url_alias', value: null, type: 'array' } });
          }
        }}
      >
        <EditForm />
      </SidebarModal>
      <Permalink
        path={modifiedUrlAliases?.length > 0 ? modifiedUrlAliases[0].url_path : ''}
      />
    </CheckPermissions>
  );
};

export default EditView;
