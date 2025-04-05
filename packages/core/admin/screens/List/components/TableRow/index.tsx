import React, { FC } from 'react';
import {
  Typography,
  Box,
  Tr,
  Td,
  Flex,
  IconButton,
} from '@strapi/design-system';
import { useNotification, getFetchClient } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { Trash, ExternalLink, Pencil } from '@strapi/icons';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { Config } from '../../../../../server/config';
import { UrlAliasEntity } from '../../../../types/url-aliases';
import { EnabledContentType } from '../../../../types/enabled-contenttypes';

type Props = {
  row: UrlAliasEntity;
  checked?: boolean;
  contentTypes: EnabledContentType[];
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
  contentTypes,
  onDelete,
}) => {
  const { toggleNotification } = useNotification();
  const { get, post } = getFetchClient();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    get<{ link: string }>(`/webtools/url-alias/editLink?path=${path}`)
      .then((res) => {
        navigate(res.data.link);
      })
      .catch(() => { });
  };

  const handleDelete = (id: string) => {
    post(`/webtools/url-alias/delete/${id}`)
      .then(() => {
        if (onDelete) onDelete();
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools.settings.success.url_alias.delete' }) });
      })
      .catch(() => {
        if (onDelete) onDelete();
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  };

  const getContentTypeName = (uid: string): string | undefined => {
    const contentType = contentTypes.find((type) => type.uid === uid);
    return contentType?.name;
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
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{getContentTypeName(row.contenttype)}</Typography>
        </Box>
      </Td>
      <Td>
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{row.locale}</Typography>
        </Box>
      </Td>
      <Td>
        <Flex justifyContent="end">
          {config.website_url && (
            <IconButton
              onClick={() => window.open(`${config.website_url}${row.url_path}`, '_blank')}
              label={formatMessage(
                { id: 'webtools.settings.page.list.table.actions.edit', defaultMessage: 'Go to the front-end page' },
                { target: `${row.url_path}` },
              )}
            >
              <ExternalLink />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleClick(row.url_path)}
            label={formatMessage(
              { id: 'webtools.settings.page.list.table.actions.goTo', defaultMessage: 'Edit {target}' },
              { target: `${row.url_path}` },
            )}
          >
            <Pencil />
          </IconButton>
          <DeleteConfirmModal
            onSubmit={() => handleDelete(row.documentId)}
          >
            <IconButton
              label={formatMessage(
                { id: 'webtools.settings.page.list.table.actions.delete', defaultMessage: 'Delete {target}' },
                { target: `${row.url_path}` },
              )}
            >
              <Trash />
            </IconButton>
          </DeleteConfirmModal>
        </Flex>
      </Td>
    </Tr>
  );
};

export default TableRow;
