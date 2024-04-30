import React from 'react';
import { useIntl } from 'react-intl';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Typography,
  Stack,
  Button,
} from '@strapi/design-system';
import { ExclamationMarkCircle } from '@strapi/icons';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const DeleteConfirmModal = (props: Props) => {
  const {
    isOpen,
    onClose,
    onSubmit,
  } = props;

  const { formatMessage } = useIntl();

  if (!isOpen) return null;

  return (
    <Dialog
      onClose={onClose}
      title={formatMessage({
        id: 'webtools.settings.page.list.delete_confirm_modal.title',
        defaultMessage: 'Delete item',
      })}
      isOpen={isOpen}
    >
      <DialogBody icon={<ExclamationMarkCircle />}>
        <Stack size={2}>
          <Flex justifyContent="center">
            <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
              {formatMessage({
                id: 'webtools.settings.page.list.delete_confirm_modal.body',
                defaultMessage: 'Are you sure you want to delete this item?',
              })}
            </Typography>
          </Flex>
        </Stack>
      </DialogBody>
      <DialogFooter
        startAction={(
          <Button
            onClick={() => {
              onClose();
            }}
            variant="tertiary"
          >
            {formatMessage({
              id: 'webtools.settings.button.delete',
              defaultMessage: 'Delete',
            })}
          </Button>
        )}
        endAction={(
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              onSubmit();
            }}
          >
            {formatMessage({
              id: 'webtools.settings.button.cancel',
              defaultMessage: 'Cancel',
            })}
          </Button>
        )}
      />
    </Dialog>
  );
};

export default DeleteConfirmModal;
