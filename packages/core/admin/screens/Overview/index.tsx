import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import {
  Typography,
  Grid,
  Flex,
  Link,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardContent,
  Box,
  Badge,
  Button,
} from '@strapi/design-system';
import {
  ExternalLink, PuzzlePiece, Lock, Check,
} from '@strapi/icons';
import { Page, getFetchClient, Layouts } from '@strapi/strapi/admin';
import { useQuery } from 'react-query';

import pluginPermissions from '../../permissions';
import { WebtoolsAddonInfo } from '../../types/addons';
import packageJson from '../../../package.json';
import { EnabledContentTypes } from '../../types/enabled-contenttypes';
import ContentTypesList from './components/ContentTypesList';
import { PRO_ADDONS, TRIAL_URL } from '../../constants/pro-addons';
import TrialModal from '../../components/TrialModal';

const List = () => {
  const { get } = getFetchClient();
  const addons = useQuery('addons', async () => get<WebtoolsAddonInfo[]>('/webtools/info/addons'));
  const contentTypes = useQuery('content-types', async () => get<EnabledContentTypes>('/webtools/info/getContentTypes'));
  const { formatMessage } = useIntl();
  const [selectedAddon, setSelectedAddon] = useState<typeof PRO_ADDONS[0] | null>(null);

  if (addons.isLoading || contentTypes.isLoading) {
    return (
      <Page.Loading />
    );
  }

  if (addons.error || contentTypes.error) {
    return (
      <Page.Error />
    );
  }

  const installedAddons = Object.values(addons.data.data || {});

  // Strip npm scope for comparison: "@pluginpal/webtools-addon-redirects" → "webtools-addon-redirects"
  const getPluginName = (packageName: string) =>
    packageName.includes('/') ? packageName.split('/')[1] : packageName;

  const installedPluginNames = installedAddons.map((addon) => addon.info.name);

  const isAddonInstalled = (packageName: string): boolean => {
    return installedPluginNames.includes(getPluginName(packageName));
  };

  // Only show locked Pro addons that are NOT installed
  const lockedProAddons = PRO_ADDONS.filter((proAddon) => !isAddonInstalled(proAddon.packageName));

  // Check if user has Pro license (at least one Pro addon installed)
  const hasProLicense = PRO_ADDONS.some((proAddon) => isAddonInstalled(proAddon.packageName));

  // Combine installed and locked pro addons
  const allAddonsToShow = [
    ...installedAddons.map((addon) => ({
      type: 'installed' as const,
      info: addon.info,
    })),
    ...lockedProAddons.map((proAddon) => ({
      type: 'locked' as const,
      info: {
        name: proAddon.packageName,
        addonName: proAddon.name,
        description: proAddon.description,
      },
      proAddon,
    })),
  ];

  return (
    <Page.Protect permissions={pluginPermissions['settings.overview']}>
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
                    id: 'webtools.settings.application.version',
                    defaultMessage: 'Webtools version',
                  })}
                </Typography>
                <Flex gap={3} direction="row" alignItems="center" marginTop={2}>
                  <Typography>v{packageJson.version}</Typography>
                  {!hasProLicense && (
                    <Button
                      variant="success"
                      size="S"
                      tag="a"
                      href={TRIAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formatMessage({
                        id: 'webtools.overview.try_premium',
                        defaultMessage: 'Try Premium Free',
                      })}
                    </Button>
                  )}
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
        <Typography variant="delta" marginTop={6} marginBottom={3} display="block">
          {formatMessage({
            id: 'global.enabled_contenttypes',
            defaultMessage: 'Enabled content types',
          })}
        </Typography>
        <Box width="100%">
          <ContentTypesList contentTypes={contentTypes.data.data} />
        </Box>
        {!isEmpty(allAddonsToShow) && (
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
            <Box marginTop={4} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {allAddonsToShow.map((addon) => {
                const isLocked = addon.type === 'locked';

                return (
                  <Card
                    style={{
                      minHeight: '200px',
                      cursor: isLocked ? 'pointer' : 'default',
                      opacity: isLocked ? 0.85 : 1,
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    key={addon.info.name}
                    onClick={
                      isLocked
                        ? () => setSelectedAddon(addon.proAddon)
                        : undefined
                    }
                  >
                    <CardBody
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        padding: '20px',
                      }}
                    >
                      {/* Badge positioned absolutely in top-right */}
                      <Box
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          zIndex: 1,
                        }}
                      >
                        {isLocked ? (
                          <Badge size="S">
                            {formatMessage({
                              id: 'webtools.overview.addon.pro',
                              defaultMessage: 'PRO',
                            })}
                          </Badge>
                        ) : (
                          <Badge active size="S">
                            <Flex gap={1} alignItems="center">
                              <Check width="10px" height="10px" />
                              {formatMessage({
                                id: 'webtools.overview.addon.active',
                                defaultMessage: 'Active',
                              })}
                            </Flex>
                          </Badge>
                        )}
                      </Box>

                      {/* Icon */}
                      <Box
                        padding={2}
                        background={isLocked ? 'neutral200' : 'primary100'}
                        hasRadius
                        marginBottom={3}
                      >
                        {isLocked ? <Lock /> : <PuzzlePiece />}
                      </Box>

                      {/* Content with padding-right to prevent badge overlap */}
                      <CardContent
                        paddingLeft={0}
                        paddingRight={0}
                        paddingTop={0}
                        paddingBottom={0}
                        style={{
                          flex: 1,
                        }}
                      >
                        <CardTitle
                          style={{
                            paddingRight: '60px',
                            marginBottom: '8px',
                          }}
                        >
                          {addon.info.addonName}
                        </CardTitle>
                        <CardSubtitle
                          style={{
                            hyphens: 'none',
                            wordBreak: 'normal',
                            overflowWrap: 'break-word',
                            lineHeight: '1.5',
                          }}
                        >
                          {addon.info.description}
                        </CardSubtitle>
                      </CardContent>
                    </CardBody>
                  </Card>
                );
              })}
            </Box>
          </Flex>
        )}
      </Layouts.Content>

      {selectedAddon && (
        <TrialModal
          addon={selectedAddon}
          isOpen={!!selectedAddon}
          onClose={() => setSelectedAddon(null)}
        />
      )}
    </Page.Protect>
  );
};

export default List;
