import React from 'react';
import { useIntl } from 'react-intl';

import { Table, Tr, Thead, Th, VisuallyHidden, Typography } from '@strapi/design-system';
import { EmptyStateLayout } from '@strapi/helper-plugin';

import TableBody from '../TableBody';

const TableComponent = ({ patterns }) => {
  const { formatMessage } = useIntl();

  const colCount = 3;
  const rowCount = (patterns?.length || 0) + 1;

  return (
    <div>
      {patterns && patterns.length > 0 ? (
        <Table colCount={colCount} rowCount={rowCount}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'settings.page.patterns.table.head.label', defaultMessage: 'Label' })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'settings.page.patterns.table.head.pattern',
                    defaultMessage: 'Pattern',
                  })}
                </Typography>
              </Th>
              <Th>
                <VisuallyHidden>
                  {formatMessage({
                    id: 'settings.page.patterns.table.head.actions',
                    defaultMessage: 'Actions',
                  })}
                </VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <TableBody
            patterns={patterns}
          />
          {/* TODO: Pagination */}
        </Table>
      ) : (
        <EmptyStateLayout
          content={{
            id: 'settings.page.patterns.table.empty',
            defaultMessage: "You don't have any patterns yet.",
          }}
          action={() => {}}
          shadow="tableShadow"
          hasRadius
        />
      )}
    </div>
  );
};

export default TableComponent;
