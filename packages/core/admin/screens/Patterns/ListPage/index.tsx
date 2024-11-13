import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import {
  Loader,
  ContentLayout,
  HeaderLayout,
  Button,
  Box,
} from '@strapi/design-system';

import { Plus } from '@strapi/icons';
import { getFetchClient } from '@strapi/strapi/admin';

import pluginId from '../../../helpers/pluginId';
import Table from './components/Table';
import Center from '../../../components/Center';
import { PatternEntity } from '../../../types/url-patterns';

const ListPatternPage = () => {
  const [patterns, setPatterns] = useState<PatternEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { push } = useHistory();
  const { get } = getFetchClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await get<PatternEntity[]>('/webtools/url-pattern/findMany');
        setPatterns(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error('Failed to fetch data:', error);
    });
  }, [get]);

  if (loading) {
    return (
      <Center>
        <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>
      </Center>
    );
  }

  return (
    <Box>
      <HeaderLayout
        title={formatMessage({ id: 'webtools.settings.page.patterns.title', defaultMessage: 'Patterns' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.patterns.description', defaultMessage: 'A list of all the known URL alias patterns.' })}
        as="h2"
        primaryAction={(
          <Button onClick={() => push(`/plugins/${pluginId}/patterns/new`)} startIcon={<Plus />} size="L">
            {formatMessage({
              id: 'webtools.settings.button.add_pattern',
              defaultMessage: 'Add new pattern',
            })}
          </Button>
                )}
      />
      <ContentLayout>
        <Table patterns={patterns} />
      </ContentLayout>
    </Box>
  );
};

export default ListPatternPage;
