import React from 'react';
import { useIntl } from 'react-intl';

import {
  Dialog,
  Flex,
  Typography,
  Button,
} from '@strapi/design-system';
import { WarningCircle } from '@strapi/icons';

type Props = {
  onSubmit: () => void;
  children: React.ReactNode;
};

const DeleteConfirmModal = (props: Props) => {
  const {
    onSubmit,
    children,
  } = props;

  const { formatMessage } = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {children}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {formatMessage({
            id: 'webtools.settings.page.list.delete_confirm_modal.title',
            defaultMessage: 'Delete item',
          })}
        </Dialog.Header>
        <Dialog.Body icon={<WarningCircle />}>
          <Flex>
            <Flex justifyContent="center">
              <Typography variant="omega" id="confirm-description" style={{ textAlign: 'center' }}>
                {formatMessage({
                  id: 'webtools.settings.page.list.delete_confirm_modal.body',
                  defaultMessage: 'Are you sure you want to delete this item?',
                })}
              </Typography>
            </Flex>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button
              variant="tertiary"
            >
              {formatMessage({
                id: 'webtools.settings.button.cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>
          </Dialog.Cancel>
          <Button
            variant="secondary"
            onClick={() => {
              onSubmit();
            }}
          >
            {formatMessage({
              id: 'webtools.settings.button.delete',
              defaultMessage: 'Delete',
            })}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteConfirmModal;
