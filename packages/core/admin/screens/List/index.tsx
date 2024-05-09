import React, { useEffect, useState } from 'react';
import { EntityService, Attribute } from '@strapi/types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ContentLayout, HeaderLayout, Button } from '@strapi/design-system';
import {
  CheckPagePermissions,
  request,
  useFetchClient,
  useNotification,
} from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';
import Table from './components/Table';
import Center from '../../components/Center';
import { Config } from '../../../server/admin-api/config';
import GeneratePathsModal from './components/GeneratePathsModal';
import { EnabledContentType, EnabledContentTypes } from '../../types/enabled-contenttypes';
import { GenerationType } from '../../../server/types';
import Loader from '../../components/Loader';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

const List = () => {
  const [queryCount, setQueryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
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
      .catch(() => {
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  }, [get, toggleNotification]);

  useEffect(() => {
    request(`/webtools/url-alias/findMany${history.location.search}`, { method: 'GET' })
      .then((res: EntityService.PaginatedResult<'plugin::webtools.url-alias'>) => {
        setPaths(res.results);
        setPagination(res.pagination);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  }, [history.location.search, queryCount, toggleNotification]);

  useEffect(() => {
    request('/webtools/info/config', { method: 'GET' })
      .then((res: Config) => {
        setConfig(res);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  }, [toggleNotification]);

  const handleGeneratePaths = async (types: EnabledContentType['uid'][], generationType: GenerationType) => {
    setLoading(true);
    await post('/webtools/url-alias/generate', { types, generationType })
      .then((response: { data: { message: string } }) => {
        toggleNotification({ type: 'success', message: { id: 'webtools.success.url-alias.generate', defaultMessage: response.data.message } });
        setLoading(false);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
        setLoading(false);
      });

    setQueryCount(queryCount + 1);
  };

  if (!paths || !config || !pagination) {
    return (
      <Loader />
    );
  }

  return (
    <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
      {loading && <Loader />}
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleGeneratePaths}
        onClose={() => setOpenModal(false)}
        contentTypes={contentTypes}
      />
    </CheckPagePermissions>
  );
};

export default List;
