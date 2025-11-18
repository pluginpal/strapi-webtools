import React from 'react';
import {
  Typography,
  Box,
  Tr,
  Td,
  Flex,
  IconButton,
} from '@strapi/design-system';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Pencil, Trash } from '@strapi/icons';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';
import { deleteSitemap } from '../../../../state/actions/Sitemap';

const TableRow = ({
  row,
  id,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const { del, get } = useFetchClient();

  const handleClick = () => {
    navigate(`/plugins/webtools/sitemap/${id}`);
  };

  const handleDeleteClick = () => {
    dispatch(deleteSitemap(id, del, get, toggleNotification, formatMessage));
  };

  return (
    <Tr>
      <Td>
        <Box style={{ marginTop: 20, marginBottom: 20, marginLeft: 8, marginRight: 8 }}>
          <Typography>{id}</Typography>
        </Box>
      </Td>
      <Td>
        <Box style={{ marginTop: 20, marginBottom: 20, marginLeft: 8, marginRight: 8 }}>
          <Typography>{row.hostname}</Typography>
        </Box>
      </Td>
      <Td>
        <Flex>
          <Flex marginLeft="auto">
            <IconButton
              onClick={handleClick}
              label="Edit"
            >
              <Pencil />
            </IconButton>
            <Box paddingLeft={1}>
              <DeleteConfirmModal onSubmit={handleDeleteClick}>
                <IconButton
                  label="Delete"
                >
                  <Trash />
                </IconButton>
              </DeleteConfirmModal>
            </Box>
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
};

export default TableRow;
