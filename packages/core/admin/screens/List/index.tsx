import React, { useEffect, useState } from 'react';
import { EntityService, Attribute } from '@strapi/types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ContentLayout, HeaderLayout, Button } from '@strapi/design-system';
import { CheckPagePermissions, request, useFetchClient, useNotification } from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';
import Table from './components/Table';
import Center from '../../components/Center';
import { Config } from '../../../server/admin-api/config';
import GeneratePathsModal from './components/GeneratePathsModal';
import { EnabledContentType, EnabledContentTypes } from '../../types/enabled-contenttypes';
import { GenerationType } from '../../../server/types';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

const List = () => {
  const [queryCount, setQueryCount] = useState<number>(0);
  const [paths, setPaths] = useState<Attribute.GetValues<'plugin::webtools.url-alias'>[]>(null);
  const [config, setConfig] = useState<Config>(null);
  const [pagination, setPagination] = useState<Pagination>(null);
  const [openModal, setOpenModal] = useState<boolean>(null);
  const { post } = useFetchClient();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const [contentTypes, setContentTypes] = useState<EnabledContentTypes>([]);
  const toggleNotification = useNotification();

  useEffect(() => {
    get('/webtools/info/getContentTypes')
      .then((res: { data: EnabledContentTypes }) => {
        setContentTypes(res.data);
      })
      .catch((error) => {
        throw new Error(error);
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  }, [get]);

  useEffect(() => {
    request(`/webtools/url-alias/findMany${history.location.search}`, { method: 'GET' })
      .then((res: EntityService.PaginatedResult<'plugin::webtools.url-alias'>) => {
        setPaths(res.results);
        setPagination(res.pagination);
      })
      .catch((error) => {
        throw new Error(error);
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  }, [history.location.search, queryCount]);

  useEffect(() => {
    request('/webtools/info/config', { method: 'GET' })
      .then((res: Config) => {
        setConfig(res);
      })
      .catch((error) => {
        throw new Error(error);
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  }, []);

  const handleGeneratePaths = async (types: EnabledContentType['uid'][], generationType: GenerationType) => {
    await post('/webtools/url-alias/generate', { types, generationType })
      .then((response) => {
        toggleNotification({ type: 'success', message: { id: 'webtools.success.url-alias.generate', defaultMessage: response.data.message } });
      })
      .catch((error) => {
        throw new Error(error);
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });

    setQueryCount(queryCount + 1)
  };

  // TODO: fix loading state
  if (!paths || !config || !pagination) {
    return (
      <Center>
        Loading
      </Center>
    );
  }

  return (
    <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
      <HeaderLayout
        title={formatMessage({ id: 'webtools.settings.page.list.title', defaultMessage: 'URLs' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.list.description', defaultMessage: 'A list of all the known URL aliases.' })}
        as="h2"
        // TODO: Generate all button.
        primaryAction={(
          <Button onClick={() => setOpenModal(true)} size="L">
            {formatMessage({
              id: 'webtools.settings.button.generate_paths',
              // defaultMessage: 'Generate paths',
            })}
          </Button>
        )}
      />
      <ContentLayout>
        <Table
          paths={paths}
          pagination={pagination}
          onDelete={() => setQueryCount(queryCount + 1)}
          config={config}
          contentTypes={contentTypes}
        />
      </ContentLayout>
      <GeneratePathsModal
        isOpen={openModal}
        onSubmit={handleGeneratePaths}
        onClose={() => setOpenModal(false)}
        contentTypes={contentTypes}
      />
    </CheckPagePermissions>
  );
};

export default List;
