import React, { FC, useState } from 'react';
import {
  Typography,
  Box,
  Tr,
  Td,
  Flex,
  IconButton,
} from '@strapi/design-system';
import {
  request,
  useNotification,
} from '@strapi/helper-plugin';
import { Attribute, Entity } from '@strapi/strapi';
import { useIntl } from 'react-intl';
import { Trash, ExternalLink, Pencil } from '@strapi/icons';
import { useHistory } from 'react-router-dom';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { Config } from '../../../../../server/admin-api/config';

type Props = {
  row: Attribute.GetValues<'plugin::webtools.url-alias'>;
  checked?: boolean;
  onDelete?: () => void;
  updateValue: () => any;
  config: Config;
};

const TableRow: FC<Props> = ({
  row,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checked,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateValue,
  config,
  onDelete,
}) => {
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { push } = useHistory();

  const handleClick = (path: string) => {
    request(`/webtools/url-alias/editLink?path=${path}`, { method: 'GET' })
      .then((res: { link: string }) => {
        push(res.link);
      })
      .catch(() => { });
  };

  const handleDelete = (id: Entity.ID) => {
    request(`/webtools/url-alias/delete/${id}`, { method: 'POST' })
      .then((res) => {
        onDelete();
        toggleNotification({ type: 'success', message: { id: 'webtools.settings.success.url_alias.delete' } });
      })
      .catch((error) => {
        throw new Error(error);
        onDelete();
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  };

  return (
    <Tr>
      {/* <Td>
        <BaseCheckbox
          aria-label={`Select ${row.url_path}`}
          value={checked}
          onValueChange={updateValue}
        />
      </Td> */}
      <Td>
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{row.url_path}</Typography>
        </Box>
      </Td>
      <Td>
        <Flex justifyContent="end">
          {config.website_url && (
            <IconButton
              onClick={() => window.open(`${config.website_url}${row.url_path}`, '_blank')}
              noBorder
              icon={<ExternalLink />}
              label={formatMessage(
                { id: 'webtools.settings.page.list.table.actions.edit', defaultMessage: 'Go to the front-end page' },
                { target: `${row.url_path}` },
              )}
            />
          )}
          <IconButton
            onClick={() => handleClick(row.url_path)}
            noBorder
            icon={<Pencil />}
            label={formatMessage(
              { id: 'webtools.settings.page.list.table.actions.goTo', defaultMessage: 'Edit {target}' },
              { target: `${row.url_path}` },
            )}
          />
          <IconButton
            onClick={() => setOpenDeleteModal(true)}
            noBorder
            icon={<Trash />}
            label={formatMessage(
              { id: 'webtools.settings.page.list.table.actions.delete', defaultMessage: 'Delete {target}' },
              { target: `${row.url_path}` },
            )}
          />
          <DeleteConfirmModal
            isOpen={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onSubmit={() => handleDelete(row.id)}
          />
        </Flex>
      </Td>
    </Tr>
  );
};

export default TableRow;
