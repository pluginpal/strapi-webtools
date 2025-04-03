import React from 'react';
import { useIntl } from 'react-intl';
import {
  useQuery,
  useQueryClient,
} from 'react-query';
import { Button } from '@strapi/design-system';
import { useNavigate } from 'react-router-dom';
import { Plus } from '@strapi/icons';
import {
  Page,
  getFetchClient,
  Layouts,
  useRBAC,
} from '@strapi/strapi/admin';

import pluginPermissions from '../../permissions';
import TableComponent from './components/Table';
import { GenericResponse } from '../../types/content-api';
import { Redirect } from '../../types/redirect';
import useQueryParams from './hooks/useQueryParams';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

const List = () => {
  const { get } = getFetchClient();
  const params = useQueryParams();
  const {
    allowedActions: { canCreate },
  } = useRBAC(pluginPermissions);

  const items = useQuery(['redirects', params], async () => get<GenericResponse<Redirect[]>>(`/webtools/redirects?${params}`));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  if (items.isLoading) {
    return (
      <Page.Loading />
    );
  }

  if (items.isError) {
    return (
      <Page.Error />
    );
  }

  return (
    <Page.Protect permissions={pluginPermissions['settings.list']}>
      <Layouts.Header
        title={formatMessage({ id: 'webtools-addon-redirects.settings.page.list.title', defaultMessage: 'Redirects' })}
        subtitle={formatMessage({ id: 'webtools-addon-redirects.settings.page.list.description', defaultMessage: 'A list of all the redirects.' })}
        primaryAction={canCreate && (
          <Button onClick={() => navigate('/plugins/webtools/redirects/new')} startIcon={<Plus />}>
            {formatMessage({
              id: 'webtools-addon-redirects.settings.page.list.button.add',
              defaultMessage: 'Add new redirect',
            })}
          </Button>
        )}
      />
      <Layouts.Content>
        <TableComponent
          items={items.data.data.data}
          pagination={items.data.data.meta.pagination}
          onDelete={() => queryClient.invalidateQueries('redirects')}
        />
      </Layouts.Content>
    </Page.Protect>
  );
};

export default List;
