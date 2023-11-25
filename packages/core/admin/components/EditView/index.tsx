import React from 'react';
import { useIntl } from 'react-intl';
import { SidebarModal } from '@strapi-webtools/helper-plugin';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import getTrad from '../../helpers/getTrad';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { createUrlAlias, updateUrlAlias } from '../../api/url-alias';
import { isContentTypeEnabled } from '../../../server/util/enabledContentTypes';
import { UrlAliasEntity } from '../../types/url-aliases';

const EditView = () => {
  const { formatMessage } = useIntl();
  const {
    allLayoutData,
    modifiedData,
    initialData,
    onChange,
    slug,
  } = useCMEditViewDataManager();

  if (!isContentTypeEnabled(allLayoutData.contentType)) return null;
  const modifiedUrlAlias = modifiedData.url_alias as UrlAliasEntity;

  const onSubmit = async () => {
    if (!initialData.url_alias) {
      const urlAlias = await createUrlAlias(modifiedUrlAlias, slug);
      onChange({ target: { name: 'url_alias', value: urlAlias } });
    } else {
      await updateUrlAlias(modifiedUrlAlias, slug);
    }
  };

  return (
    <>
      <SidebarModal
        label={formatMessage({
          id: getTrad('plugin.name'),
          defaultMessage: 'URL alias',
        })}
        onSubmit={onSubmit}
        onCancel={() => onChange({ target: { name: 'url_alias', value: initialData.url_alias } })}
      >
        <EditForm />
      </SidebarModal>
      <Permalink
        path={modifiedUrlAlias?.url_path}
      />
    </>
  );
};

export default EditView;
