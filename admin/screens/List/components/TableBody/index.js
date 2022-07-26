import React from 'react';
import { Typography } from '@strapi/design-system/Typography';
import { Box } from '@strapi/design-system/Box';
import { Tbody, Tr, Td } from '@strapi/design-system/Table';
import { onRowClick, request } from '@strapi/helper-plugin';
import { useHistory } from 'react-router-dom';

const TableBody = ({ paths }) => {
  const { push } = useHistory();

  const handleClick = (path) => {
    request(`/url-alias/path/editLink?path=${path}`, { method: 'GET' })
      .then((res) => {
        push(res.link);
      })
      .catch(() => {
      });
  };

  return (
    <Tbody>
      {paths.map((path) => (
        <Tr key={path.url_path} {...onRowClick({ fn: () => handleClick(path.url_path) })}>
          <Td width="20%">
            <Box style={{ marginTop: 5, marginBottom: 5 }}>
              <Typography>{path.url_path}</Typography>
            </Box>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};

export default TableBody;
