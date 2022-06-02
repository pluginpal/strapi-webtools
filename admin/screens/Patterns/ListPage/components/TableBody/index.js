import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@strapi/design-system/IconButton';
import { Typography } from '@strapi/design-system/Typography';
import { Flex } from '@strapi/design-system/Flex';
import { Tbody, Tr, Td } from '@strapi/design-system/Table';
import Pencil from '@strapi/icons/Pencil';
import Trash from '@strapi/icons/Trash';
import { onRowClick, stopPropagation } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import pluginId from '../../../../../helpers/pluginId';

const TableBody = ({ patterns }) => {
  const { formatMessage } = useIntl();
  const { push } = useHistory();

  const handleClickDelete = (id) => {
  };

  const handleClickEdit = (id) => {
    push(`/settings/${pluginId}/patterns/${id}`);
  };

  return (
    <Tbody>
      {patterns.map((pattern) => (
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
                  { id: 'app.component.table.edit', defaultMessage: 'Edit {target}' },
                  { target: `${pattern.label}` },
                )}
              />
              <IconButton
                onClick={() => handleClickDelete(pattern.id)}
                noBorder
                icon={<Trash />}
                label={formatMessage(
                  { id: 'global.delete-target', defaultMessage: 'Delete {target}' },
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

TableBody.defaultProps = {
  canDelete: false,
};

TableBody.propTypes = {
  onDelete: PropTypes.array.isRequired,
  permissions: PropTypes.object.isRequired,
  setRoleToDelete: PropTypes.func.isRequired,
  sortedRoles: PropTypes.array.isRequired,
  canDelete: PropTypes.bool,
};
