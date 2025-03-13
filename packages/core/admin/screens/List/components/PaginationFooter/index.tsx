import React from 'react';
import { Box } from '@strapi/design-system';
import { Pagination as StrapiPagination } from '@strapi/strapi/admin';
import type { Pagination } from '../..';

type Props = {
  pagination: Pagination;
};

const PaginationFooter = ({ pagination }: Props) => {
  return (
    <Box paddingTop={4}>
      <StrapiPagination.Root {...pagination}>
        <StrapiPagination.PageSize />
        <StrapiPagination.Links />
      </StrapiPagination.Root>
    </Box>
  );
};

export default PaginationFooter;
