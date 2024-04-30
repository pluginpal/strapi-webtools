import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Button,
  Box,
  Flex,
} from '@strapi/design-system';
import { Filter } from '@strapi/icons';

import {
  FilterListURLQuery,
  FilterPopoverURLQuery,
  SearchURLQuery,
} from '@strapi/helper-plugin';
import FilterInput from './FilterInput';
import { EnabledContentTypes } from '../../../../types/enabled-contenttypes';

type Props = {
  contentTypes: EnabledContentTypes,
};

const Filters = ({ contentTypes }: Props) => {
  const { formatMessage } = useIntl();
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef();

  const filters = useMemo(() => {
    const newFilters = [];

    if (contentTypes.length > 0) {
      newFilters.push({
        name: 'contenttype',
        metadatas: {
          label: 'Content-Type',
          // eslint-disable-next-line react/no-unstable-nested-components
          customInput: (props) => <FilterInput contentTypes={contentTypes} {...props} />,
        },
        fieldSchema: {
          type: 'string',
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return newFilters;
  }, [contentTypes]);


  return (
    <Flex gap="1" marginBottom="6">
      <SearchURLQuery
        label={formatMessage({
          id: 'webtools.settings.page.list.filters.label',
          defaultMessage: 'Search',
        })}
        placeholder={formatMessage({
          id: 'webtools.settings.page.list.filters.placeholder',
          defaultMessage: 'Search...',
        })}
        trackedEvent="didSearch"
      />
      <Box paddingTop={1} paddingBottom={1}>
        <Button
          variant="tertiary"
          ref={buttonRef}
          startIcon={<Filter />}
          onClick={() => setIsVisible((prev) => !prev)}
          size="S"
        >
          {formatMessage({
            id: 'webtools.settings.button.filters',
            defaultMessage: 'Filters',
          })}
        </Button>
        {isVisible && (
          <FilterPopoverURLQuery
            displayedFilters={filters}
            isVisible={isVisible}
            onToggle={() => setIsVisible((prev) => !prev)}
            source={buttonRef}
          />
        )}
      </Box>
      <FilterListURLQuery
        filtersSchema={filters}
      />
    </Flex>
  );
};

export default Filters;
