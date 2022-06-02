import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import Plus from '@strapi/icons/Plus';

import getTrad from '../../../helpers/getTrad';
import pluginId from '../../../helpers/pluginId';
import Table from './components/Table';

const ListPatternPage = () => {
  const { formatMessage } = useIntl();
  const { push } = useHistory();

  const patterns = [
    {
      id: 1,
      label: "article",
      pattern: "/test/[id]/test",
      contentTypes: [],
      languages: [],
    },
    {
      id: 2,
      label: "article",
      pattern: "/test/[id]/test",
      contentTypes: [],
      languages: [],
    },
  ];

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
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <Table patterns={patterns} />
        </Box>
      </ContentLayout>
    </Box>
  );
};

export default ListPatternPage;
