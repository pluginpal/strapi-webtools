import React, { useState } from 'react';
import {
  IconButton, Typography, Flex, Tbody, Tr, Td,
} from '@strapi/design-system';
import { Pencil, Trash } from '@strapi/icons';
import {
  onRowClick, stopPropagation, request, useNotification,
} from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import pluginId from '../../../../../helpers/pluginId';
import { PatternEntity } from '../../../../../types/url-patterns';

interface Props {
  patterns: PatternEntity[]
}

const TableBody: React.FC<Props> = ({ patterns }) => {
  const [statePatterns, setStatePatterns] = useState(patterns);
  const { formatMessage } = useIntl();
  const { push } = useHistory();
  const toggleNotification = useNotification();

  const handleClickDelete = (id: number) => {
    request(`/webtools/url-pattern/delete/${id}`, {
      method: 'GET',
    })
      .then(() => {
        const newPatterns = statePatterns.filter((pattern) => pattern.id !== id);
        setStatePatterns(newPatterns);
        toggleNotification({ type: 'success', message: { id: 'webtools.settings.success.delete' } });
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
      });
  };

  const handleClickEdit = (id: number) => {
    push(`/plugins/${pluginId}/patterns/${id}`);
  };

  return (
    <Tbody>
      {statePatterns.map((pattern) => (
        <Tr key={pattern.label} {...onRowClick({ fn: () => handleClickEdit(pattern.id) })}>
          <Td width="20%">
            <Typography>{pattern.label}</Typography>
          </Td>
          <Td width="50%">
            <Typography>{pattern.pattern}</Typography>
          </Td>
          <Td>
            <Flex justifyContent="end" {...stopPropagation}>
              <IconButton
                onClick={() => handleClickEdit(pattern.id)}
                noBorder
                icon={<Pencil />}
                label={formatMessage(
                  { id: 'webtools.settings.page.patterns.table.actions.edit', defaultMessage: 'Edit {target}' },
                  { target: `${pattern.label}` },
                )}
              />
              <IconButton
                onClick={() => handleClickDelete(pattern.id)}
                noBorder
                icon={<Trash />}
                label={formatMessage(
                  { id: 'webtools.settings.page.patterns.table.actions.delete', defaultMessage: 'Delete {target}' },
                  { target: `${pattern.label}` },
                )}
              />
            </Flex>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};

export default TableBody;
