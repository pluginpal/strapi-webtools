/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { Filters, useField } from '@strapi/admin/strapi-admin';

const FilterInput = (props: Filters.ValueInputProps) => {
  const { name, options } = props;

  const field = useField(name);

  const handleChange = (value?: string) => {
    field.onChange(name, value);
  };

  return (
    <SingleSelect key="type-filter" onChange={handleChange} value={field.value}>
      {options.map((contentType) => (
        <SingleSelectOption key={contentType.value} value={String(contentType.value)}>
          {contentType.label}
        </SingleSelectOption>
      ))}
    </SingleSelect>
  );
};

export default FilterInput;
