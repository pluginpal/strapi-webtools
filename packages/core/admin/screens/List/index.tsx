import React from 'react';
import { useIntl } from 'react-intl';
import {
  useQuery,
  useQueryClient,
} from 'react-query';

import { Button } from '@strapi/design-system';

import {
  Page,
  useNotification,
  getFetchClient,
  Layouts,
} from '@strapi/strapi/admin';

import pluginPermissions from '../../permissions';
import Table from './components/Table';
import GeneratePathsModal from './components/GeneratePathsModal';
import { EnabledContentType, EnabledContentTypes } from '../../types/enabled-contenttypes';
import { GenerationType } from '../../../server/types';
import { GenericResponse } from '../../types/content-api';
import { Config } from '../../../server/config';
import { UrlAliasEntity } from '../../types/url-aliases';
import useQueryParams from '../../hooks/useQueryParams';
import { Locales } from '../../types/languages';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

const List = () => {
  const { get } = getFetchClient();
  const params = useQueryParams();

  const items = useQuery(['url-alias', params], async () => get<GenericResponse<UrlAliasEntity[]>>(`/webtools/url-alias/findMany?${params}`));
  const contentTypes = useQuery('content-types', async () => get<EnabledContentTypes>('/webtools/info/getContentTypes'));
  const locales = useQuery('languages', async () => get<Locales>('/webtools/info/getLanguages'));
  const config = useQuery('config', async () => get<Config>('/webtools/info/config'));
  const queryClient = useQueryClient();

  const { post } = getFetchClient();

  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  const handleGeneratePaths = async (types: EnabledContentType['uid'][], generationType: GenerationType) => {
    await post('/webtools/url-alias/generate', { types, generationType })
      .then((response: { data: { message: string } }) => {
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools.success.url-alias.generate', defaultMessage: response.data.message }) });
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });

    await queryClient.invalidateQueries('url-alias');
  };

  if (items.isLoading || config.isLoading || contentTypes.isLoading || locales.isLoading) {
    return (
      <Page.Loading />
    );
  }

  if (items.isError || config.isError || contentTypes.isError || locales.isError) {
    return (
      <Page.Error />
    );
  }

  return (
    <Page.Protect permissions={pluginPermissions['settings.list']}>
      <Layouts.Header
        title={formatMessage({ id: 'webtools.settings.page.list.title', defaultMessage: 'All URLs' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.list.description', defaultMessage: 'A list of all the known URL aliases.' })}
        primaryAction={(
          <GeneratePathsModal
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleGeneratePaths}
            contentTypes={contentTypes.data.data}
          >
            <Button>
              {formatMessage({
                id: 'webtools.settings.button.generate_paths',
                defaultMessage: 'Bulk generate',
              })}
            </Button>
          </GeneratePathsModal>
        )}
      />
      <Layouts.Content>
        <Table
          paths={items.data.data.data}
          pagination={items.data.data.meta.pagination}
          onDelete={() => queryClient.invalidateQueries('url-alias')}
          config={config.data.data}
          locales={locales.data.data}
          contentTypes={contentTypes.data.data}
        />
      </Layouts.Content>
    </Page.Protect>
  );
};

export default List;
