import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Attribute } from '@strapi/strapi';

import {
  Table,
  Tr,
  Thead,
  Th,
  Typography,
  Dots,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
} from '@strapi/design-system';

import { EmptyStateLayout } from '@strapi/helper-plugin';

import TableBody from '../TableBody';

type Props = {
  paths: Attribute.GetValues<'plugin::webtools.url-alias'>[],
};

const TableComponent: FC<Props> = ({ paths }) => {
  const { formatMessage } = useIntl();

  const colCount = 1;
  const rowCount = (paths?.length || 0) + 1;

  return (
    <div>
      {paths && paths.length > 0 ? (
        <>
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
          <Pagination activePage={1} pageCount={26}>
            <PreviousLink to="?page=1">Go to previous page</PreviousLink>
            <PageLink number={1} to="?page=1">
              Go to page 1
            </PageLink>
            <PageLink number={2} to="?page=2">
              Go to page 2
            </PageLink>
            <Dots>And 23 other links</Dots>
            <PageLink number={25} to="/25">
              Go to page 3
            </PageLink>
            <PageLink number={26} to="/26">
              Go to page 26
            </PageLink>
            <NextLink to="/3">Go to next page</NextLink>
          </Pagination>
        </>
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
