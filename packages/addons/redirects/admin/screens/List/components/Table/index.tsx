import React, {
  FC,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Table,
  Tr,
  Thead,
  Th,
  Typography,
  Tbody,
  EmptyStateLayout,
} from '@strapi/design-system';

import TableRow from '../TableRow';
import PaginationFooter from '../PaginationFooter';
import type { Pagination } from '../..';
import Filters from '../Filters';
import { Redirect } from '../../../../types/redirect';

type Props = {
  items: Redirect[],
  onDelete: () => any,
  pagination: Pagination,
};

const TableComponent: FC<Props> = (props) => {
  const {
    items,
    pagination,
    onDelete,
  } = props;

  const { formatMessage } = useIntl();

  return (
    <div>
      <Filters />
      {items && items.length > 0 ? (
        <Table colCount={1} rowCount={pagination.pageSize}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'webtools-addon-redirects.settings.page.list.table.head.from', defaultMessage: 'From' })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'webtools-addon-redirects.settings.page.list.table.head.to', defaultMessage: 'To' })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'webtools-addon-redirects.settings.page.list.table.head.status_code', defaultMessage: 'Status Code' })}
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((path) => (
              <TableRow
                key={path.id}
                row={path}
                onDelete={onDelete}
              />
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyStateLayout
          content={formatMessage({
            id: 'webtools-addon-redirects.settings.page.list.table.empty',
            defaultMessage: 'No redirects were found.',
          })}
          shadow="tableShadow"
          hasRadius
        />
      )}
      <PaginationFooter pagination={pagination} />
    </div>
  );
};

export default TableComponent;
