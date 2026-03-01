import React from 'react';
import { useIntl } from 'react-intl';
import {
  Modal,
  Flex,
  Typography,
  Button,
  Box,
  Badge,
  Grid,
} from '@strapi/design-system';
import {
  ArrowRight,
  Link as LinkIcon,
  ExternalLink,
} from '@strapi/icons';
import { TrialModalProps } from '../../types/pro-addons';
import { TRIAL_URL } from '../../constants/pro-addons';

const iconMap = {
  ArrowRight,
  Link: LinkIcon,
  ArrowsLeftRight: ArrowRight,
};

const TrialModal: React.FC<TrialModalProps> = ({ addon, isOpen, onClose }) => {
  const { formatMessage } = useIntl();
  const IconComponent = iconMap[addon.icon as keyof typeof iconMap] || ArrowRight;

  if (!isOpen) return null;

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content style={{ maxWidth: '800px' }}>
        <Modal.Header>
          <Flex gap={3} alignItems="center">
            <Box padding={3} background="primary100" hasRadius>
              <IconComponent width="24px" height="24px" />
            </Box>
            <Flex direction="column" gap={1} alignItems="flex-start">
              <Flex alignItems="center" gap={2}>
                <Typography variant="beta">
                  {formatMessage({
                    id: 'webtools.trial_modal.title',
                    defaultMessage: 'Unlock {name}',
                  }, { name: addon.name })}
                </Typography>
                <Badge size="S">
                  {formatMessage({
                    id: 'webtools.overview.addon.pro',
                    defaultMessage: 'PRO',
                  })}
                </Badge>
              </Flex>
              <Typography variant="omega" textColor="neutral600">
                {addon.tagline}
              </Typography>
            </Flex>
          </Flex>
        </Modal.Header>

        <Modal.Body>
          <Flex direction="column" gap={6}>
            {/* Two column layout: Key Benefits | Trial Details */}
            <Grid.Root gap={8}>
              {/* Left column: Key Benefits */}
              <Grid.Item col={6} s={12}>
                <Box>
                  <Typography variant="sigma" textColor="neutral600" marginBottom={3} textTransform="uppercase">
                    {formatMessage({
                      id: 'webtools.trial_modal.benefits_title',
                      defaultMessage: 'Key Benefits',
                    })}
                  </Typography>
                  <Flex direction="column" gap={2} alignItems="flex-start">
                    {addon.benefits.map((benefit) => (
                      <Flex key={benefit} gap={2} alignItems="flex-start">
                        <Box style={{ minWidth: '16px', textAlign: 'left' }}>
                          <Typography variant="pi" textColor="primary600">
                            •
                          </Typography>
                        </Box>
                        <Typography
                          variant="pi"
                          textColor="neutral700"
                          style={{
                            flex: 1,
                            lineHeight: '1.6',
                            hyphens: 'none',
                            wordBreak: 'normal',
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </Grid.Item>

              {/* Right column: Trial Details */}
              <Grid.Item col={6} s={12}>
                <Box>
                  <Typography variant="sigma" textColor="neutral600" marginBottom={3} textTransform="uppercase">
                    {formatMessage({
                      id: 'webtools.trial_modal.trial_details_title',
                      defaultMessage: 'Trial Details',
                    })}
                  </Typography>
                  <Flex direction="column" gap={2} alignItems="flex-start">
                    <Flex gap={2} alignItems="flex-start">
                      <Box style={{ minWidth: '16px', textAlign: 'left' }}>
                        <Typography variant="pi" textColor="success600">
                          ✓
                        </Typography>
                      </Box>
                      <Typography variant="pi" textColor="neutral700">
                        {formatMessage({
                          id: 'webtools.trial_modal.trial_detail_1',
                          defaultMessage: '7-day free trial',
                        })}
                      </Typography>
                    </Flex>
                    <Flex gap={2} alignItems="flex-start">
                      <Box style={{ minWidth: '16px', textAlign: 'left' }}>
                        <Typography variant="pi" textColor="success600">
                          ✓
                        </Typography>
                      </Box>
                      <Typography variant="pi" textColor="neutral700">
                        {formatMessage({
                          id: 'webtools.trial_modal.trial_detail_2',
                          defaultMessage: 'Includes Redirects + Links addons',
                        })}
                      </Typography>
                    </Flex>
                    <Flex gap={2} alignItems="flex-start">
                      <Box style={{ minWidth: '16px', textAlign: 'left' }}>
                        <Typography variant="pi" textColor="success600">
                          ✓
                        </Typography>
                      </Box>
                      <Typography variant="pi" textColor="neutral700">
                        {formatMessage({
                          id: 'webtools.trial_modal.trial_detail_3',
                          defaultMessage: 'No credit card required',
                        })}
                      </Typography>
                    </Flex>
                    <Flex gap={2} alignItems="flex-start">
                      <Box style={{ minWidth: '16px', textAlign: 'left' }}>
                        <Typography variant="pi" textColor="success600">
                          ✓
                        </Typography>
                      </Box>
                      <Typography variant="pi" textColor="neutral700">
                        {formatMessage({
                          id: 'webtools.trial_modal.trial_detail_4',
                          defaultMessage: 'Cancel anytime',
                        })}
                      </Typography>
                    </Flex>
                  </Flex>
                </Box>
              </Grid.Item>
            </Grid.Root>

            {/* Testimonial */}
            <Box
              background="neutral100"
              padding={5}
              hasRadius
              style={{
                borderLeft: '3px solid var(--primary-600)',
              }}
            >
              <Typography
                variant="omega"
                fontStyle="italic"
                textColor="neutral700"
                marginBottom={2}
                style={{
                  lineHeight: '1.6',
                  hyphens: 'none',
                  wordBreak: 'normal',
                }}
              >
                {formatMessage({
                  id: 'webtools.trial_modal.testimonial',
                  defaultMessage: '"Saved us 20+ hours per project. Essential for our agency workflow."',
                })}
              </Typography>
              <Typography variant="pi" textColor="neutral600" fontWeight="semiBold">
                {formatMessage({
                  id: 'webtools.trial_modal.testimonial_author',
                  defaultMessage: '— Marcus, Digital Agency Owner',
                })}
              </Typography>
            </Box>
          </Flex>
        </Modal.Body>

        <Modal.Footer>
          <Flex justifyContent="space-between" width="100%" gap={3}>
            <Button
              variant="tertiary"
              tag="a"
              href={addon.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<ExternalLink />}
            >
              {formatMessage({
                id: 'webtools.trial_modal.learn_more',
                defaultMessage: 'Learn More',
              })}
            </Button>
            <Button
              variant="default"
              size="L"
              tag="a"
              href={TRIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatMessage({
                id: 'webtools.trial_modal.start_trial',
                defaultMessage: 'Start Free Trial',
              })}
            </Button>
          </Flex>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default TrialModal;
