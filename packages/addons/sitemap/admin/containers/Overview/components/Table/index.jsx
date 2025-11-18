import React from 'react';
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
import { Map } from 'immutable';

import { useSelector } from 'react-redux';
import TableRow from '../TableRow';

const TableComponent = () => {
  const sitemaps = useSelector((state) => state.getIn(['sitemap', 'settings', 'sitemaps'], Map()));
  const { formatMessage } = useIntl();

  return (
    <div>
      {sitemaps && sitemaps.size > 0 ? (
        <Table colCount={1} rowCount={sitemaps.size}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600" margin={2}>
                  {formatMessage({ id: 'sitemap.Overview.Table.Head.Name', defaultMessage: 'Name' })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600" margin={2}>
                  {formatMessage({ id: 'sitemap.Overview.Table.Head.Hostname', defaultMessage: 'Hostname' })}
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(sitemaps.toJS()).map(([key, value]) => (
              <TableRow
                key={key}
                id={key}
                row={value}
              />
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyStateLayout
          content={formatMessage({
            id: 'sitemap.Overview.Table.Empty',
            defaultMessage: 'You don\'t have any sitemaps yet.',
          })}
          shadow="tableShadow"
          hasRadius
        />
      )}
    </div>
  );
};

export default TableComponent;
