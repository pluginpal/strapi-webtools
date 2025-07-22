import React from 'react';
import { useIntl } from 'react-intl';

import {
  Modal,
  Button,
  Typography,
  Checkbox,
  Radio,
  Flex,
  Box,
} from '@strapi/design-system';

import { EnabledContentType, EnabledContentTypes } from '../../../../types/enabled-contenttypes';
import { GenerationType } from '../../../../../server/types';

type Props = {
  onSubmit: (types: EnabledContentType['uid'][], generationType?: GenerationType) => Promise<void>;
  contentTypes: EnabledContentTypes;
  children: React.ReactElement<any, string>;
};

const GeneratePathsModal = ({
  onSubmit,
  contentTypes,
  children,
}: Props) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const { formatMessage } = useIntl();
  const [selectedContentTypes, setSelectedContentTypes] = React.useState<EnabledContentType['uid'][]>([]);
  const [selectedGenerationType, setSelectedGenerationType] = React.useState<GenerationType>();

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger>
        {children}
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Typography textColor="neutral800" variant="omega" fontWeight="bold">
            {formatMessage({
              id: 'webtools.settings.page.list.generate_paths_modal.title',
              defaultMessage: 'Generate URL aliases',
            })}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" alignItems="start" gap="7">
            <Flex direction="column" alignItems="start" gap="2">
              <Typography variant="delta">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.types.title',
                  defaultMessage: 'Content types',
                })}
              </Typography>
              <Typography variant="omega">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.types.body',
                  defaultMessage: 'Select the content types you want to generate the URLs for.',
                })}
              </Typography>
              <Flex direction="column" alignItems="start" gap="1" marginTop="2">
                {contentTypes.map((contentType) => (
                  <Checkbox
                    key={contentType.uid}
                    aria-label={`Select ${contentType.name}`}
                    checked={selectedContentTypes.includes(contentType.uid)}
                    onCheckedChange={() => {
                      if (selectedContentTypes.includes(contentType.uid)) {
                        const newContentTypes = selectedContentTypes
                          .filter((uid) => uid !== contentType.uid);

                        setSelectedContentTypes(newContentTypes);

                        return;
                      }

                      setSelectedContentTypes([...selectedContentTypes, contentType.uid]);
                    }}
                  >
                    {contentType.name}
                  </Checkbox>
                ))}
              </Flex>
            </Flex>
            <Flex direction="column" alignItems="start" gap="2">
              <Typography variant="delta">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.generation_type.title',
                  defaultMessage: 'Generation type',
                })}
              </Typography>
              <Typography variant="omega">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.generation_type.body',
                  defaultMessage: 'Select how you would like to generate the URLs.',
                })}
              </Typography>
              <Box marginTop="2">
                <Radio.Group onValueChange={(value: GenerationType) => setSelectedGenerationType(value)} value={selectedGenerationType} name="meal">
                  <Flex direction="column" alignItems="start" gap="2">
                    <Radio.Item value="only_without_alias">
                      {formatMessage({
                        id: 'webtools.settings.page.list.generate_paths_modal.generation_type.only_without_alias',
                        defaultMessage: 'Generate only for pages without an URL alias',
                      })}
                    </Radio.Item>
                    <Radio.Item value="only_generated">
                      {formatMessage({
                        id: 'webtools.settings.page.list.generate_paths_modal.generation_type.only_generated',
                        defaultMessage: 'Re-generate only URL alias that were auto-generated',
                      })}
                    </Radio.Item>
                    <Radio.Item value="all">
                      {formatMessage({
                        id: 'webtools.settings.page.list.generate_paths_modal.generation_type.all',
                        defaultMessage: 'Re-generate all URL aliases',
                      })}
                    </Radio.Item>
                  </Flex>
                </Radio.Group>
              </Box>
            </Flex>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">
              {formatMessage({
                id: 'webtools.settings.button.cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>
          </Modal.Close>
          <Button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              try {
                setSubmitting(true);
                await onSubmit(selectedContentTypes, selectedGenerationType);
                setOpen(false);
              } finally {
                setSubmitting(false);
              }
            }}
            loading={submitting}
          >
            {formatMessage({
              id: 'webtools.settings.button.generate_paths',
              defaultMessage: 'Bulk generate',
            })}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default GeneratePathsModal;
