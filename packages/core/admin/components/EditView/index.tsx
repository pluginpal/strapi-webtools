import React from 'react';
import { useIntl } from 'react-intl';
import { SidebarModal } from '@strapi-webtools/helper-plugin';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import getTrad from '../../helpers/getTrad';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { createUrlAlias, updateUrlAlias } from '../../api/url-alias';

const EditView = () => {
  const { formatMessage } = useIntl();
  const {
    allLayoutData,
    modifiedData,
    initialData,
    onChange,
    slug,
  }: any = useCMEditViewDataManager();

  if (!allLayoutData.contentType.pluginOptions?.webtools?.enabled) return null;

  const onSubmit = async () => {
    if (!initialData.url_alias) {
      const urlAlias = await createUrlAlias(modifiedData.url_alias, slug);
      onChange({ target: { name: 'url_alias', value: urlAlias } });
    } else {
      await updateUrlAlias(modifiedData.url_alias, slug);
    }
  };

  return (
    <>
      <SidebarModal
        label={formatMessage({
          id: getTrad("plugin.name"),
          defaultMessage: `URL alias`,
        })}
        onSubmit={onSubmit}
        onCancel={() => onChange({ target: { name: `url_alias`, value: initialData.url_alias } })}
      >
        <EditForm />
      </SidebarModal>
      <Permalink
        path={modifiedData.url_alias?.url_path}
      />
    </>
  );
};

export default EditView;
