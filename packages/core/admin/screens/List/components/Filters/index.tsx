import React, {
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Flex,
} from '@strapi/design-system';

import { Filters as StrapiFilters, SearchInput } from '@strapi/strapi/admin';
import FilterInput from './FilterInput';
import { EnabledContentType, EnabledContentTypes } from '../../../../types/enabled-contenttypes';

type Props = {
  contentTypes: EnabledContentTypes,
};

const Filters = ({ contentTypes }: Props) => {
  const { formatMessage } = useIntl();

  const filters = useMemo(() => {
    const newFilters: StrapiFilters.Filter[] = [];

    if (contentTypes.length > 0) {
      newFilters.push(
        {
          input: FilterInput,
          label: 'Content-Type',
          name: 'contenttype',
          options: contentTypes.map((contenttype: EnabledContentType) => ({
            label: contenttype.name,
            value: contenttype.uid,
          })),
          type: 'string',
        },
      );
    }

    return newFilters;
  }, [contentTypes]);


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
