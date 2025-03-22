import React, {
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Flex,
} from '@strapi/design-system';

import { Filters as StrapiFilters, SearchInput } from '@strapi/strapi/admin';
import FilterInput from './FilterInput';
import { EnabledContentTypes } from '../../../../types/enabled-contenttypes';
import { Locales } from '../../../../types/languages';

type Props = {
  contentTypes: EnabledContentTypes,
  locales: Locales,
};

const Filters = ({ contentTypes, locales }: Props) => {
  const { formatMessage } = useIntl();

  const filters = useMemo(() => {
    const newFilters: StrapiFilters.Filter[] = [];

    if (contentTypes.length > 0) {
      newFilters.push(
        {
          input: FilterInput,
          label: 'Content-Type',
          name: 'contenttype',
          options: contentTypes.map((contenttype) => ({
            label: contenttype.name,
            value: contenttype.uid,
          })),
          type: 'string',
        },
        {
          input: FilterInput,
          label: 'Locale',
          name: 'locale',
          options: locales.map((locale) => ({
            label: locale.name,
            value: locale.uid,
          })),
          type: 'string',
        },
      );
    }

    return newFilters;
  }, [contentTypes, locales]);


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
