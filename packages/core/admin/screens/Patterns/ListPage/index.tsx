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
import { getFetchClient, Layouts } from '@strapi/strapi/admin';

import pluginId from '../../../helpers/pluginId';
import Table from './components/Table';
import Center from '../../../components/Center';
import { PatternEntity } from '../../../types/url-patterns';
import { GenericResponse } from '../../../types/content-api';

const ListPatternPage = () => {
  const { get } = getFetchClient();
  const items = useQuery(['url-patterns'], async () => get<GenericResponse<PatternEntity[]>>('/webtools/url-pattern/findMany'));

  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  if (items.isLoading) {
    return (
      <Center>
        <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>
      </Center>
    );
  }

  return (
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
        <Table patterns={items.data.data.data} />
      </Layouts.Content>
    </Box>
  );
};

export default ListPatternPage;
