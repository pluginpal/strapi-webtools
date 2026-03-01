import React from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Flex,
  Typography,
  Button,
} from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';
import { TRIAL_URL, DOCS_URL } from '../../../../constants/pro-addons';
import packageJson from '../../../../../package.json';

const HeroSection = () => {
  const { formatMessage } = useIntl();

  return (
    <Box
      hasRadius
      background="neutral0"
      shadow="tableShadow"
      paddingTop={8}
      paddingBottom={8}
      paddingRight={8}
      paddingLeft={8}
    >
      <Flex direction="column" alignItems="center" gap={2}>
        <Typography variant="beta" textAlign="center">
          {formatMessage({
            id: 'webtools.overview.hero.title',
            defaultMessage: 'Welcome to Webtools {version}',
          }, { version: `v${packageJson.version}` })}
        </Typography>

        <Typography variant="omega" textColor="neutral600" textAlign="center">
          {formatMessage({
            id: 'webtools.overview.hero.subtitle',
            defaultMessage: 'Everything you need to build professional websites with Strapi CMS',
          })}
        </Typography>

        <Flex gap={2} marginTop={3}>
          <Button
            variant="default"
            size="S"
            tag="a"
            href={TRIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {formatMessage({
              id: 'webtools.overview.hero.trial_button_short',
              defaultMessage: 'Start Free Trial',
            })}
          </Button>
          <Button
            variant="tertiary"
            size="S"
            tag="a"
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<ExternalLink />}
          >
            {formatMessage({
              id: 'webtools.overview.hero.docs_button',
              defaultMessage: 'View Documentation',
            })}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default HeroSection;
