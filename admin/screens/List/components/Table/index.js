import React from 'react';
import { useIntl } from 'react-intl';

import { Table, Tr, Thead, Th } from '@strapi/design-system/Table';
import { Typography } from '@strapi/design-system/Typography';
import {
  EmptyStateLayout,
} from '@strapi/helper-plugin';

import TableBody from '../TableBody';

const TableComponent = ({ paths }) => {
  const { formatMessage } = useIntl();

  const colCount = 1;
  const rowCount = (paths?.length || 0) + 1;

  return (
    <div>
      {paths && paths.length > 0 ? (
        <Table colCount={colCount} rowCount={rowCount}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'settings.page.patterns.table.head.label', defaultMessage: 'Path' })}
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <TableBody
            paths={paths}
          />
        </Table>
      ) : (
        <EmptyStateLayout content={{
          id: 'settings.page.list.table.empty',
          defaultMessage: "You don't have any URL paths yet.",
        }} />
      )}
    </div>
  );
};

export default TableComponent;
