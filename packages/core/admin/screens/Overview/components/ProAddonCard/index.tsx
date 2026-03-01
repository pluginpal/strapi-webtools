import React from 'react';
import { useIntl } from 'react-intl';
import {
  Card,
  CardBody,
  CardContent,
  CardTitle,
  Box,
  Flex,
  Typography,
  Button,
  Badge,
} from '@strapi/design-system';
import {
  ArrowRight,
  Link as LinkIcon,
  Check,
} from '@strapi/icons';
import { ProAddonCardProps } from '../../../../types/pro-addons';
import { TRIAL_URL } from '../../../../constants/pro-addons';

const iconMap = {
  ArrowRight,
  Link: LinkIcon,
  ArrowsLeftRight: ArrowRight,
};

const ProAddonCard: React.FC<ProAddonCardProps> = ({ addon, isInstalled }) => {
  const { formatMessage } = useIntl();
  const IconComponent = iconMap[addon.icon as keyof typeof iconMap] || ArrowRight;

  const handleCardClick = () => {
    if (!isInstalled) {
      window.open(TRIAL_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card
      style={{
        cursor: isInstalled ? 'default' : 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        if (!isInstalled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={handleCardClick}
    >
      <CardBody>
        <Flex justifyContent="space-between" alignItems="flex-start" marginBottom={3}>
          <Box padding={2} background="primary100" hasRadius>
            <IconComponent />
          </Box>
          {isInstalled ? (
            <Badge active size="S">
              <Flex gap={1} alignItems="center">
                <Check width="10px" height="10px" />
                {formatMessage({
                  id: 'webtools.overview.addon.active',
                  defaultMessage: 'Active',
                })}
              </Flex>
            </Badge>
          ) : (
            <Badge size="S">
              {formatMessage({
                id: 'webtools.overview.addon.pro',
                defaultMessage: 'PRO',
              })}
            </Badge>
          )}
        </Flex>

        <CardContent paddingLeft={0} paddingRight={0} paddingTop={0} paddingBottom={0}>
          <Flex direction="column" gap={2}>
            <CardTitle>{addon.name}</CardTitle>

            <Typography variant="pi" textColor="neutral600">
              {addon.tagline}
            </Typography>

            <Box marginTop={1}>
              <Typography variant="pi" textColor="neutral500" style={{ lineHeight: '1.6' }}>
                {addon.value}
              </Typography>
            </Box>

            {!isInstalled && (
              <Box marginTop={4}>
                <Button
                  variant="secondary"
                  size="S"
                  fullWidth
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    window.open(TRIAL_URL, '_blank', 'noopener,noreferrer');
                  }}
                >
                  {formatMessage({
                    id: 'webtools.overview.addon.start_trial',
                    defaultMessage: 'Start Free Trial',
                  })}
                </Button>
              </Box>
            )}
          </Flex>
        </CardContent>
      </CardBody>
    </Card>
  );
};

export default ProAddonCard;
