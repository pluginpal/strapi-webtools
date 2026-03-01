import React from 'react';
import { Page, Layouts } from '@strapi/strapi/admin';
import {
  Typography, Box, Button, Flex,
} from '@strapi/design-system';
import {
  ExternalLink, Link as LinkIcon,
} from '@strapi/icons';

const LinksOverview = () => {
  return (
    <Page.Main>
      <Layouts.Header
        title="Links"
        subtitle="Custom field for internal links"
      />
      <Layouts.Content>
        <Box
          background="neutral0"
          hasRadius
          shadow="tableShadow"
          padding={8}
        >
          <Flex
            direction="column"
            alignItems="center"
            gap={5}
          >
            <Box
              padding={3}
              background="primary100"
              hasRadius
              marginBottom={2}
            >
              <LinkIcon width="32px" height="32px" />
            </Box>
            <Typography variant="beta" textAlign="center">
              Links Custom Field
            </Typography>
            <Typography
              variant="omega"
              textColor="neutral600"
              textAlign="center"
              style={{ maxWidth: '600px' }}
            >
              The Links addon provides a custom field type for creating internal links
              that persist across URL changes. Links survive URL updates automatically.
            </Typography>
            <Box marginTop={3}>
              <Button
                variant="default"
                tag="a"
                href="https://docs.pluginpal.io/webtools/addons/links"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ExternalLink />}
              >
                View Documentation
              </Button>
            </Box>
          </Flex>
        </Box>
      </Layouts.Content>
    </Page.Main>
  );
};

export default LinksOverview;
