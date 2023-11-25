import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  ContentLayout, HeaderLayout, Typography, Grid, GridItem, Flex, Link, Box,
} from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';
import { CheckPagePermissions, request } from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';
import { WebtoolsAddonInfo } from '../../types/addons';

const List = () => {
  const [addons, setAddons] = useState<WebtoolsAddonInfo[]>(null);
  const { formatMessage } = useIntl();

  useEffect(() => {
    request<WebtoolsAddonInfo[]>('/webtools/info/addons', { method: 'GET' })
      .then((res) => {
        setAddons(res);
      })
      .catch(() => {
      });
  }, []);

  // TODO: fix loading state
  if (!addons) {
    return (
      <div>Loading...</div>
    );
  }
  const strapiVersion = '1.0.0';

  return (
    <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
      <HeaderLayout
        title={formatMessage({ id: 'webtools.settings.page.overview.title', defaultMessage: 'Overview' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.overview.description', defaultMessage: 'Webtools global information' })}
        as="h2"
        // TODO: Generate all button.
        // primaryAction={(
        //   <Button onClick={() => console.log('generate')} size="L">
        //     {formatMessage({
        //       id: 'webtools.settings.button.generate_paths',
        //       defaultMessage: 'Generate paths',
        //     })}
        //   </Button>
        // )}
      />
      <ContentLayout>
        <Flex direction="column" alignItems="stretch" gap={6}>
          <Flex
            direction="column"
            alignItems="stretch"
            gap={4}
            hasRadius
            background="neutral0"
            shadow="tableShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingRight={7}
            paddingLeft={7}
          >
            <Typography variant="delta" as="h3">
              {formatMessage({
                id: 'global.details',
                defaultMessage: 'Details',
              })}
            </Typography>

            <Grid gap={5} as="dl">
              <GridItem col={6} s={12}>
                <Typography variant="sigma" textColor="neutral600" as="dt">
                  {formatMessage({
                    id: 'Settings.application.strapiVersion',
                    defaultMessage: 'strapi version',
                  })}
                </Typography>
                <Flex gap={3} direction="column" alignItems="start" as="dd">
                  <Typography>v{strapiVersion}</Typography>
                </Flex>
              </GridItem>
              <GridItem col={6} s={12}>
                <Typography variant="sigma" textColor="neutral600" as="dt">
                  {formatMessage({
                    id: 'TODO_REPLACE',
                    defaultMessage: 'Links',
                  })}
                </Typography>
                <Flex>
                  <Link
                    href="https://strapi.io/pricing-self-hosted"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'TODO_REPLACE',
                      defaultMessage: 'Website',
                    })}
                  </Link>
                </Flex>
                <Flex>
                  <Link
                    href="https://strapi.io/pricing-self-hosted"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'TODO_REPLACE',
                      defaultMessage: 'Documentation',
                    })}
                  </Link>
                </Flex>
                <Flex>
                  <Link
                    href="https://strapi.io/pricing-self-hosted"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'TODO_REPLACE',
                      defaultMessage: 'Github',
                    })}
                  </Link>
                </Flex>
              </GridItem>
            </Grid>
          </Flex>
        </Flex>
        <Box
          hasRadius
          background="neutral0"
          shadow="tableShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingRight={7}
          paddingLeft={7}
        >
          <Typography variant="delta" as="h3">
            {formatMessage({
              id: 'TODO_REPLACE',
              defaultMessage: 'Addons',
            })}
          </Typography>
          <Typography variant="pi" textColor="neutral600">
            {formatMessage(
              {
                id: 'TODO_REPLACE',
                defaultMessage: 'All the installed addons',
              },
            )}
          </Typography>
          <Flex>
            {Object.values(addons).map((addon) => (
              <div>{addon.info.addonName}</div>
            ))}
          </Flex>
        </Box>
      </ContentLayout>
    </CheckPagePermissions>
  );
};

export default List;
