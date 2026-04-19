import React from 'react';
import { useIntl } from 'react-intl';
import {
  Card,
  CardBody,
  CardContent,
  CardTitle,
  Box,
  Flex,
  Badge,
  Grid,
  Typography,
} from '@strapi/design-system';
import { PuzzlePiece, Check } from '@strapi/icons';
import { WebtoolsAddonInfo } from '../../../../types/addons';

interface AddonsListProps {
  addons: WebtoolsAddonInfo[];
}

const AddonsList: React.FC<AddonsListProps> = ({ addons }) => {
  const { formatMessage } = useIntl();

  return (
    <Grid.Root gap={5}>
      {addons.map((addon) => (
        <Grid.Item key={addon.info.name} col={4} s={6} xs={12}>
          <Card style={{ height: '100%' }}>
            <CardBody>
              <Flex justifyContent="space-between" alignItems="flex-start" marginBottom={3}>
                <Box padding={2} background="primary100" hasRadius>
                  <PuzzlePiece />
                </Box>
                <Badge active size="S">
                  <Flex gap={1} alignItems="center">
                    <Check width="10px" height="10px" />
                    {formatMessage({
                      id: 'webtools.overview.addon.active',
                      defaultMessage: 'Active',
                    })}
                  </Flex>
                </Badge>
              </Flex>
              <CardContent paddingLeft={0} paddingRight={0} paddingTop={0} paddingBottom={0}>
                <Flex direction="column" gap={2}>
                  <CardTitle>{addon.info.addonName}</CardTitle>
                  <Typography variant="pi" textColor="neutral600" style={{ lineHeight: '1.6' }}>
                    {addon.info.description}
                  </Typography>
                </Flex>
              </CardContent>
            </CardBody>
          </Card>
        </Grid.Item>
      ))}
    </Grid.Root>
  );
};

export default AddonsList;
