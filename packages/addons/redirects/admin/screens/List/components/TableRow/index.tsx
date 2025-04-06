import React, { FC } from 'react';
import {
  Typography,
  Box,
  Tr,
  Td,
  Flex,
  IconButton,
} from '@strapi/design-system';
import { useNotification, getFetchClient, useRBAC } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { Trash, Pencil } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { Redirect } from '../../../../types/redirect';
import pluginPermissions from '../../../../permissions';

type Props = {
  row: Redirect;
  onDelete?: () => void;
};

const TableRow: FC<Props> = ({
  row,
  onDelete,
}) => {
  const { toggleNotification } = useNotification();
  const {
    allowedActions: { canEdit, canDelete },
  } = useRBAC(pluginPermissions);
  const { del } = getFetchClient();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    del(`/webtools/redirects/${id}`)
      .then(() => {
        if (onDelete) onDelete();
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools-addon-redirects.settings.success.delete', defaultMessage: 'The redirect was successfully deleted.' }) });
      })
      .catch(() => {
        if (onDelete) onDelete();
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  };

  return (
    <Tr>
      <Td>
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{row.from}</Typography>
        </Box>
      </Td>
      <Td>
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{row.to}</Typography>
        </Box>
      </Td>
      <Td>
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{row.status_code}</Typography>
        </Box>
      </Td>
      <Td>
        <Flex justifyContent="end" gap={2}>
          {canEdit && (
            <IconButton
              onClick={() => navigate(`/plugins/webtools/redirects/${row.documentId}`)}
              label={formatMessage(
                { id: 'webtools-addon-redirects.settings.page.list.table.actions.edit', defaultMessage: 'Edit' },
              )}
            >
              <Pencil />
            </IconButton>
          )}
          {canDelete && (
            <DeleteConfirmModal
              onSubmit={() => handleDelete(row.documentId)}
            >
              <IconButton
                label={formatMessage(
                  { id: 'webtools-addon-redirects.settings.page.list.table.actions.delete', defaultMessage: 'Delete' },
                )}
              >
                <Trash />
              </IconButton>
            </DeleteConfirmModal>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

export default TableRow;
