import React from 'react';
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

  if (!allLayoutData.contentType) return null;

  if (!isContentTypeEnabled(allLayoutData.contentType)) return null;
  const modifiedUrlAlias = modifiedData.url_alias as UrlAliasEntity;
  const initialUrlAlias = initialData.url_alias as UrlAliasEntity;

  const onSubmit = async () => {
    if (!initialUrlAlias) {
      const urlAlias = await createUrlAlias(modifiedUrlAlias, slug);
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
