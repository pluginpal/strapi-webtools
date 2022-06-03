import React from 'react';
import { useIntl } from 'react-intl';

import { Table, Tr, Thead, Th } from '@strapi/design-system/Table';
import { VisuallyHidden } from '@strapi/design-system/VisuallyHidden';
import { Typography } from '@strapi/design-system/Typography';
import {
  EmptyStateLayout,
} from '@strapi/helper-plugin';

import getTrad from '../../../../../helpers/getTrad';
import TableBody from '../TableBody';

const TableComponent = ({ patterns }) => {
  const { formatMessage } = useIntl();

  const colCount = 4;
  const rowCount = (patterns?.length || 0) + 1;

  return (
    <div>
      {patterns && patterns.length > 0 ? (
        <Table colCount={colCount} rowCount={rowCount}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'global.name', defaultMessage: 'Name' })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'global.description',
                    defaultMessage: 'Description',
                  })}
                </Typography>
              </Th>
              <Th>
                <VisuallyHidden>
                  {formatMessage({
                    id: 'global.actions',
                    defaultMessage: 'Actions',
                  })}
                </VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <TableBody
            patterns={patterns}
          />
        </Table>
      ) : (
        <EmptyStateLayout content={{
          id: getTrad('Roles.empty'),
          defaultMessage: "You don't have any roles yet.",
        }} />
      )}
    </div>
  );
};

export default TableComponent;
