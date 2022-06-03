import React from 'react';
import { useIntl } from 'react-intl';

import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { CheckPagePermissions } from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';

const List = () => {
  const { formatMessage } = useIntl();

  return (
    <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
      <HeaderLayout
        title={formatMessage({ id: 'url-alias.settings.page.list.title', defaultMessage: "List" })}
        subtitle={formatMessage({ id: 'url-alias.settings.page.list.description', defaultMessage: "A list of all the known URL aliases." })}
        as="h2"
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
          {formatMessage({ id: 'url-alias.settings.page.list.body', defaultMessage: "List all URL aliases" })}
        </Box>
      </ContentLayout>
    </CheckPagePermissions>
  );
};

export default List;
