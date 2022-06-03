import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Loader } from '@strapi/design-system/Loader';

import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import Plus from '@strapi/icons/Plus';
import { request } from '@strapi/helper-plugin';

import pluginId from '../../../helpers/pluginId';
import Table from './components/Table';
import Center from '../../../components/Center';

const ListPatternPage = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { push } = useHistory();

  useEffect(() => {
    setLoading(true);
    request(`/url-alias/pattern/findMany`, { method: 'GET' })
      .then((res) => {
        setPatterns(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !patterns) {
    return (
      <Center>
        <Loader>{formatMessage({ id: 'url-alias.settings.loading', defaultMessage: "Loading content..." })}</Loader>
      </Center>
    );
  }

  return (
    <Box>
      <HeaderLayout
        title={formatMessage({ id: 'url-alias.settings.page.patterns.title', defaultMessage: "Patterns" })}
        subtitle={formatMessage({ id: 'url-alias.settings.page.patterns.description', defaultMessage: "A list of all the known URL alias patterns." })}
        as="h2"
        primaryAction={(
          <Button onClick={() => push(`/settings/${pluginId}/patterns/new`)} startIcon={<Plus />} size="L">
            {formatMessage({
              id: 'url-alias.settings.button.add_pattern',
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
