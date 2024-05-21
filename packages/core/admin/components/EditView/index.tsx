import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { SidebarModal } from '@pluginpal/webtools-helper-plugin';

import { useCMEditViewDataManager, CheckPermissions } from '@strapi/helper-plugin';

import getTrad from '../../helpers/getTrad';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { createUrlAlias, updateUrlAlias } from '../../api/url-alias';
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

  const modifiedDataUrlAlias = modifiedData.url_alias as UrlAliasEntity;
  const i18nLang = new URLSearchParams(window.location.search).get('plugins[i18n][locale]');

  useEffect(() => {
    // Early return for when the i18n plugin is not enabled.
    if (!i18nLang) return;

    // If the URL alias is not the same language as the entity,
    // we should clear it. This happens when you're copying content
    // from a different locale.
    if (modifiedDataUrlAlias?.locale !== i18nLang) {
      onChange({ target: { name: 'url_alias', value: null, type: 'text' } });
    }
  }, [modifiedDataUrlAlias, onChange, i18nLang]);

  if (!allLayoutData.contentType) return null;

  if (!isContentTypeEnabled(allLayoutData.contentType)) return null;
  const modifiedUrlAlias = modifiedData.url_alias as UrlAliasEntity;
  const initialUrlAlias = initialData.url_alias as UrlAliasEntity;

  const onSubmit = async () => {
    if (!initialUrlAlias) {
      const urlAlias = await createUrlAlias(modifiedUrlAlias, slug, get);
      onChange({ target: { name: 'url_alias', value: urlAlias, type: 'text' } });
    } else {
      await updateUrlAlias(modifiedUrlAlias, slug);
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
          if (initialUrlAlias) {
            onChange({ target: { name: 'url_alias', value: initialUrlAlias, type: 'text' } });
          } else {
            onChange({ target: { name: 'url_alias', value: null, type: 'text' } });
          }
        }}
      >
        <EditForm />
      </SidebarModal>
      <Permalink
        path={modifiedUrlAlias?.url_path}
      />
    </CheckPermissions>
  );
};

export default EditView;
