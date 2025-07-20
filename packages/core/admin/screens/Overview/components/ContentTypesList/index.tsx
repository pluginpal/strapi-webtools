import * as React from 'react';
import {
  Button,
  EmptyStateLayout,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { Check, ExternalLink } from '@strapi/icons';
import { Link } from 'react-router-dom';

import { EnabledContentType } from '../../../../types/enabled-contenttypes';

type Props = {
  contentTypes: EnabledContentType[];
};

const ContentTypesList = (props: Props) => {
  const { contentTypes } = props;
  const { formatMessage } = useIntl();

  const colCount = 3;
  const rowCount = (contentTypes?.length || 0) + 1;

  return (
    <div>
      {contentTypes && contentTypes.length > 0 ? (
        <Table colCount={colCount} rowCount={rowCount}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.page.overview.contenttypes.table.head.name',
                    defaultMessage: 'Name',
                  })}
                </Typography>
              </Th>
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.page.overview.contenttypes.table.head.uid',
                    defaultMessage: 'UID',
                  })}
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {contentTypes.map((contenttype) => (
              <Tr key={contenttype.uid}>
                <Td width="50%">
                  <Typography>{contenttype.name}</Typography>
                </Td>
                <Td width="50%">
                  <Typography>{contenttype.uid}</Typography>
                </Td>
                <Td>
                  <Check />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyStateLayout
          content={formatMessage({
            id: 'webtools.settings.page.overview.contenttypes.table.empty',
            defaultMessage: 'You don\'t have Webtools enabled for any of your content types.',
          })}
          action={(
            <Button
              variant="secondary"
              tag={Link}
              to="https://docs.pluginpal.io/webtools/usage"
              startIcon={<ExternalLink />}
              target="_blank"
            >
              {formatMessage({
                id: 'webtools.settings.button.read_docs',
                defaultMessage: 'Learn how to enable Webtools',
              })}
            </Button>
          )}
          shadow="tableShadow"
          hasRadius
        />
      )}
    </div>
  );
};

export default ContentTypesList;
