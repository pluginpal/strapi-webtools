import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { CheckPagePermissions, request } from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system/Button';

import pluginPermissions from '../../permissions';
import Table from './components/Table';

const List = () => {
  const [paths, setPaths] = useState(null);
  const { formatMessage } = useIntl();

  useEffect(() => {
    request(`/url-alias/path/findMany`, { method: 'GET' })
      .then((res) => {
        setPaths(res);
      })
      .catch(() => {
      });
  }, []);

  // TODO: fix loading state
  // if (loading || !paths) {
  //   return (
  //     <Center>
  //       <Loader>{formatMessage({ id: 'url-alias.settings.loading', defaultMessage: "Loading content..." })}</Loader>
  //     </Center>
  //   );
  // }

  return (
    <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
      <HeaderLayout
        title={formatMessage({ id: 'url-alias.settings.page.list.title', defaultMessage: "List" })}
        subtitle={formatMessage({ id: 'url-alias.settings.page.list.description', defaultMessage: "A list of all the known URL aliases." })}
        as="h2"
        primaryAction={(
          <Button onClick={() => console.log('generate')} size="L">
            {formatMessage({
              id: 'url-alias.settings.button.generate_paths',
              defaultMessage: 'Generate paths',
            })}
          </Button>
        )}
      />
      <ContentLayout>
        <Table paths={paths} />
      </ContentLayout>
    </CheckPagePermissions>
  );
};

export default List;
