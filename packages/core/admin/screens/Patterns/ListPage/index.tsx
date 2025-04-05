import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Loader,
  Button,
  Box,
} from '@strapi/design-system';

import { Plus } from '@strapi/icons';
import { getFetchClient, Layouts, Page } from '@strapi/strapi/admin';

import pluginId from '../../../helpers/pluginId';
import Table from './components/Table';
import { PatternEntity } from '../../../types/url-patterns';
import { GenericResponse } from '../../../types/content-api';
import pluginPermissions from '../../../permissions';
import { EnabledContentTypes } from '../../../types/enabled-contenttypes';

const ListPatternPage = () => {
  const { get } = getFetchClient();
  const items = useQuery(['url-patterns'], async () => get<GenericResponse<PatternEntity[]>>('/webtools/url-pattern/findMany'));
  const contentTypes = useQuery('content-types', async () => get<EnabledContentTypes>('/webtools/info/getContentTypes'));

  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  if (items.isLoading || contentTypes.isLoading) {
    return (
      <Page.Loading />
    );
  }

  if (items.error || contentTypes.error) {
    return (
      <Page.Error />
    );
  }

  return (
    <Page.Protect permissions={pluginPermissions['settings.patterns']}>
      <Box>
        <Layouts.Header
          title={formatMessage({ id: 'webtools.settings.page.patterns.title', defaultMessage: 'Patterns' })}
          subtitle={formatMessage({ id: 'webtools.settings.page.patterns.description', defaultMessage: 'A list of all the known URL alias patterns.' })}
          primaryAction={(
            <Button onClick={() => navigate(`/plugins/${pluginId}/patterns/new`)} startIcon={<Plus />}>
              {formatMessage({
                id: 'webtools.settings.button.add_pattern',
                defaultMessage: 'Add new pattern',
              })}
            </Button>
          )}
        />
        <Layouts.Content>
          <Table
            patterns={items.data.data.data}
            contentTypes={contentTypes.data.data}
          />
        </Layouts.Content>
      </Box>
    </Page.Protect>
  );
};

export default ListPatternPage;
