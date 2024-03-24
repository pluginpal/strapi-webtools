import React, { FC } from 'react';
import {
  Typography,
  Box,
  Tbody,
  Tr,
  Td,
  Flex,
  IconButton,
  Dots,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
} from '@strapi/design-system';
import {
  onRowClick,
  request,
  stopPropagation,
} from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';
import { Trash } from '@strapi/icons';
import { useHistory } from 'react-router-dom';

type Props = {
  paths: {
    url_path: string;
    [key: string]: any;
  }[];
};

const TableBody: FC<Props> = ({ paths }) => {
  const { formatMessage } = useIntl();
  const { push } = useHistory();

  const handleClick = (path: string) => {
    request(`/webtools/url-alias/editLink?path=${path}`, { method: 'GET' })
      .then((res: { link: string }) => {
        push(res.link);
      })
      .catch(() => { });
  };

  return (
    <Tbody>
      {paths.map((path) => (
        <Tr
          key={path.url_path}
          {...onRowClick({ fn: () => handleClick(path.url_path) })}
        >
          <Td width="20%">
            <Box style={{ marginTop: 5, marginBottom: 5 }}>
              <Typography>{path.url_path}</Typography>
            </Box>
          </Td>
          <Td>
            <Flex justifyContent="end" {...stopPropagation}>
              <IconButton
                onClick={() => console.log('delete')}
                noBorder
                icon={<Trash />}
                label={formatMessage(
                  { id: 'webtools.settings.page.patterns.table.actions.delete', defaultMessage: 'Delete {target}' },
                  { target: `${path.url_path}` },
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
