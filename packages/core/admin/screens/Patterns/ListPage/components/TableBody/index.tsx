import React from 'react';
import {
  IconButton, Typography, Flex, Tbody, Tr, Td,
} from '@strapi/design-system';
import { Pencil, Trash } from '@strapi/icons';
import { getFetchClient, useNotification } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import pluginId from '../../../../../helpers/pluginId';
import { PatternEntity } from '../../../../../types/url-patterns';
import { EnabledContentType } from '../../../../../types/enabled-contenttypes';

interface Props {
  patterns: PatternEntity[]
  contentTypes: EnabledContentType[]
}

const TableBody: React.FC<Props> = ({ patterns, contentTypes }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const { get } = getFetchClient();
  const queryClient = useQueryClient();

  const handleClickDelete = (id: string) => {
    get(`/webtools/url-pattern/delete/${id}`)
      .then(async () => {
        await queryClient.invalidateQueries('url-patterns');
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools.settings.success.delete' }) });
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  };

  const handleClickEdit = (id: string) => {
    navigate(`/plugins/${pluginId}/patterns/${id}`);
  };

  const getContentTypeName = (uid: string): string | undefined => {
    const contentType = contentTypes.find((type) => type.uid === uid);
    return contentType?.name;
  };

  return (
    <Tbody>
      {patterns.map((pattern) => (
        <Tr key={pattern.id}>
          <Td>
            <Typography>{pattern.pattern}</Typography>
          </Td>
          <Td>
            <Typography>{getContentTypeName(pattern.contenttype)}</Typography>
          </Td>
          <Td>
            <Typography>{pattern.languages.join(', ')}</Typography>
          </Td>
          <Td>
            <Flex justifyContent="end">
              <IconButton
                onClick={() => handleClickEdit(pattern.documentId)}
                label={formatMessage(
                  { id: 'webtools.settings.page.patterns.table.actions.edit', defaultMessage: 'Edit' },
                )}
              >
                <Pencil />
              </IconButton>
              <IconButton
                onClick={() => handleClickDelete(pattern.documentId)}
                label={formatMessage(
                  { id: 'webtools.settings.page.patterns.table.actions.delete', defaultMessage: 'Delete' },
                )}
              >
                <Trash />
              </IconButton>
            </Flex>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};

export default TableBody;
