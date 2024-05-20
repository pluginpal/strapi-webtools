import React from 'react';
import { Box, Flex } from '@strapi/design-system';
import { PaginationURLQuery, PageSizeURLQuery } from '@strapi/helper-plugin';
import type { Pagination } from '../..';

type Props = {
  pagination: Pagination;
};

const PaginationFooter = ({ pagination }: Props) => {
  return (
    <Box paddingTop={4}>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <PageSizeURLQuery trackedEvent="willChangeNumberOfEntriesPerPage" />
        <PaginationURLQuery pagination={pagination} />
      </Flex>
    </Box>
  );
};

export default PaginationFooter;
