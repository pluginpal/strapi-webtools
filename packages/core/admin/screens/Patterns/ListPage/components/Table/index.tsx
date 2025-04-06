import React from 'react';
import { useIntl } from 'react-intl';

import {
  Table, Tr, Thead, Th, VisuallyHidden, Typography, EmptyStateLayout,
} from '@strapi/design-system';

import TableBody from '../TableBody';
import { PatternEntity } from '../../../../../types/url-patterns';
import { EnabledContentType } from '../../../../../types/enabled-contenttypes';

interface Props {
  patterns: PatternEntity[]
  contentTypes: EnabledContentType[]
}

const TableComponent: React.FC<Props> = ({ patterns, contentTypes }) => {
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
                  {formatMessage({
                    id: 'webtools.settings.page.patterns.table.head.pattern',
                    defaultMessage: 'Pattern',
                  })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.page.patterns.table.head.content-type',
                    defaultMessage: 'Content Type',
                  })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.page.patterns.table.head.languages',
                    defaultMessage: 'Languages',
                  })}
                </Typography>
              </Th>
              <Th>
                <VisuallyHidden>
                  {formatMessage({
                    id: 'webtools.settings.page.patterns.table.head.actions',
                    defaultMessage: 'Actions',
                  })}
                </VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <TableBody
            patterns={patterns}
            contentTypes={contentTypes}
          />
          {/* TODO: Pagination */}
        </Table>
      ) : (
        <EmptyStateLayout
          content={formatMessage({
            id: 'webtools.settings.page.patterns.table.empty',
            defaultMessage: 'You don\'t have any patterns yet.',
          })}
          shadow="tableShadow"
          hasRadius
        />
      )}
    </div>
  );
};

export default TableComponent;
