import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Loader } from '@strapi/design-system/Loader';

import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import Plus from '@strapi/icons/Plus';
import { request } from '@strapi/helper-plugin';

import getTrad from '../../../helpers/getTrad';
import pluginId from '../../../helpers/pluginId';
import Table from './components/Table';

const ListPatternPage = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { push } = useHistory();

  useEffect(() => {
    setLoading(true);
    request(`/path/pattern/findMany`, { method: 'GET' })
      .then((res) => {
        setPatterns(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !patterns) {
    return <Loader>Loading content...</Loader>;
  }

  return (
    <Box>
      <HeaderLayout
        title={formatMessage({ id: 'path.settings.page.patterns.title', defaultMessage: "Patterns" })}
        subtitle={formatMessage({ id: 'path.settings.page.patterns.title', defaultMessage: "A list of all the known URL alias patterns." })}
        as="h2"
        primaryAction={(
          <Button onClick={() => push(`/settings/${pluginId}/patterns/new`)} startIcon={<Plus />} size="L">
            {formatMessage({
              id: getTrad('List.button.roles'),
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
