import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import {
  Table, Tr, Thead, Th, Typography,
} from '@strapi/design-system';
import { EmptyStateLayout } from '@strapi/helper-plugin';

import TableBody from '../TableBody';

type Props = {
  paths?: {
    url_path: string;
    [key: string]: any;
  }[] | null;
};

const TableComponent: FC<Props> = ({ paths }) => {
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
          {/* TODO: Pagination */}
        </Table>
      ) : (
        <EmptyStateLayout
          content={{
            id: 'settings.page.list.table.empty',
            defaultMessage: 'You don\'t have any URL paths yet.',
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
