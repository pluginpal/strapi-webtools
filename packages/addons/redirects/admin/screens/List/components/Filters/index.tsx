import React, {
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Flex,
} from '@strapi/design-system';

import { Filters as StrapiFilters, SearchInput } from '@strapi/strapi/admin';

const locationFilterOperators = [
  {
    label: 'Is',
    value: '$eq',
  },
  {
    label: 'Is not',
    value: '$notEq',
  },
  {
    label: 'Contains',
    value: '$contains',
  },
];

const Filters = () => {
  const { formatMessage } = useIntl();

  const filters = useMemo(() => {
    const newFilters: StrapiFilters.Filter[] = [];

    newFilters.push(
      {
        label: 'From',
        operators: locationFilterOperators,
        name: 'from',
        type: 'string',
      },
      {
        label: 'To',
        operators: locationFilterOperators,
        name: 'to',
        type: 'string',
      },
      {
        label: 'Status Code',
        name: 'status_code',
        type: 'integer',
      },
    );

    return newFilters;
  }, []);


  return (
    <Flex gap="2" marginBottom="4">
      <SearchInput
        label="Search"
        placeholder={formatMessage({
          id: 'global.search',
          defaultMessage: 'Search',
        })}
      />
      <StrapiFilters.Root options={filters}>
        <StrapiFilters.Trigger />
        <StrapiFilters.Popover />
        <StrapiFilters.List />
      </StrapiFilters.Root>
    </Flex>
  );
};

export default Filters;
