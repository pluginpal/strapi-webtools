import React, { FC } from "react";
import { Typography, Box, Tbody, Tr, Td } from "@strapi/design-system";
import { onRowClick, request } from "@strapi/helper-plugin";
import { useHistory } from "react-router-dom";

type Props = {
  paths: {
    url_path: string;
    [key: string]: any;
  }[];
};

const TableBody: FC<Props> = ({ paths }) => {
  const { push } = useHistory();

  const handleClick = (path: string) => {
    request(`/webtools/path/editLink?path=${path}`, { method: "GET" })
      .then((res: any) => {
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
        </Tr>
      ))}
    </Tbody>
  );
};

export default TableBody;
