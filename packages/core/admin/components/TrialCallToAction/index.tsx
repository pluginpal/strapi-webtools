import React from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Flex,
  Typography,
  Button,
} from '@strapi/design-system';
import { TRIAL_URL } from '../../constants/pro-addons';

interface TrialCallToActionProps {
  variant?: 'banner' | 'card' | 'inline';
}

const TrialCallToAction: React.FC<TrialCallToActionProps> = ({ variant = 'card' }) => {
  const { formatMessage } = useIntl();

  const content = (
    <Flex direction="column" alignItems="center" gap={2}>
      <Typography variant="delta" textAlign="center">
        {formatMessage({
          id: 'webtools.overview.trial_cta.title_short',
          defaultMessage: 'Ready to unlock Pro features?',
        })}
      </Typography>

      <Typography variant="omega" textColor="neutral600" textAlign="center">
        {formatMessage({
          id: 'webtools.overview.trial_cta.subtitle',
          defaultMessage: 'Start your free 7-day trial - includes Redirects & Links addons',
        })}
      </Typography>

      <Box marginTop={3}>
        <Button
          variant="default"
          tag="a"
          href={TRIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMessage({
            id: 'webtools.overview.trial_cta.button_short',
            defaultMessage: 'Start Free Trial',
          })}
        </Button>
      </Box>
    </Flex>
  );

  if (variant === 'inline') {
    return content;
  }

  return (
    <Box
      hasRadius
      background="neutral0"
      shadow="tableShadow"
      paddingTop={8}
      paddingBottom={8}
      paddingRight={8}
      paddingLeft={8}
      style={variant === 'banner' ? { width: '100%' } : undefined}
    >
      {content}
    </Box>
  );
};

export default TrialCallToAction;
