import React from 'react';
import { useIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import {
  Typography, Grid, Flex, Link,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardContent,
  Box,
} from '@strapi/design-system';
import { ExternalLink, PuzzlePiece } from '@strapi/icons';
import { Page, getFetchClient, Layouts } from '@strapi/strapi/admin';
import { useQuery } from 'react-query';

import pluginPermissions from '../../permissions';
import { WebtoolsAddonInfo } from '../../types/addons';
import packageJson from '../../../package.json';
import Loader from '../../components/Loader';

const List = () => {
  const { get } = getFetchClient();
  const addons = useQuery('addons', async () => get<WebtoolsAddonInfo[]>('/webtools/info/addons'));
  const { formatMessage } = useIntl();

  if (addons.isLoading) {
    return (
      <Loader />
    );
  }
  return (
    <Page.Protect permissions={pluginPermissions['settings.patterns']}>
      <Layouts.Header
        title={formatMessage({ id: 'webtools.settings.page.overview.title', defaultMessage: 'Overview' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.overview.description', defaultMessage: 'Webtools global information' })}
      />
      <Layouts.Content>
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
            <Typography variant="delta">
              {formatMessage({
                id: 'global.details',
                defaultMessage: 'Details',
              })}
            </Typography>

            <Grid.Root gap={5}>
              <Grid.Item col={6} s={12} direction="column" alignItems="flex-start">
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.application.strapiVersion',
                    defaultMessage: 'Strapi version',
                  })}
                </Typography>
                <Flex gap={3} direction="column" alignItems="start">
                  <Typography>v{packageJson.version}</Typography>
                </Flex>
              </Grid.Item>
              <Grid.Item col={6} s={12} direction="column" alignItems="flex-start">
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.links',
                    defaultMessage: 'Links',
                  })}
                </Typography>
                <Flex>
                  <Link
                    href="https://www.pluginpal.io/plugin/webtools"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'webtools.settings.website',
                      defaultMessage: 'Website',
                    })}
                  </Link>
                </Flex>
                <Flex>
                  <Link
                    href="https://github.com/pluginpal/strapi-webtools"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'webtools.settings.github',
                      defaultMessage: 'Github',
                    })}
                  </Link>
                </Flex>
              </Grid.Item>
            </Grid.Root>
          </Flex>
        </Flex>
        {!isEmpty(addons.data.data) && (
          <Flex
            direction="column"
            alignItems="stretch"
            hasRadius
            background="neutral0"
            shadow="tableShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingRight={7}
            paddingLeft={7}
            marginTop={6}
          >
            <Typography variant="delta">
              {formatMessage({
                id: 'webtools.settings.addons.title',
                defaultMessage: 'Addons',
              })}
            </Typography>
            <Typography variant="pi" textColor="neutral600">
              {formatMessage(
                {
                  id: 'webtools.settings.addons.description',
                  defaultMessage: 'All the installed addons',
                },
              )}
            </Typography>
            <Flex marginTop={4}>
              {Object.values(addons.data.data).map((addon) => (
                <Card
                  style={{
                    width: '240px',
                  }}
                  id="fourth"
                >
                  <CardBody>
                    <Box padding={2} background="primary100">
                      <PuzzlePiece />
                    </Box>
                    <CardContent paddingLeft={2}>
                      <CardTitle>{addon.info.addonName}</CardTitle>
                      <CardSubtitle>{addon.info.description}</CardSubtitle>
                    </CardContent>
                  </CardBody>
                </Card>
              ))}
            </Flex>
          </Flex>
        )}
      </Layouts.Content>
    </Page.Protect>
  );
};

export default List;
