import React from 'react';
import { Select, Option } from '@strapi/design-system';
import { EnabledContentTypes } from '../../../../../types/enabled-contenttypes';

type Props = {
  label: string,
  onChange: (value: string) => void,
  value: string,
  contentTypes: EnabledContentTypes,
};

const FilterInput = ({
  label = '',
  onChange,
  value = '',
  contentTypes,
}: Props) => {
  return (
    <Select key="type-filter" aria-label={label} onChange={(newValue) => onChange(String(newValue))} value={value}>
      {contentTypes.map((contentType) => (
        <Option key={contentType.uid} value={contentType.uid}>
          {contentType.name}
        </Option>
      ))}
    </Select>
  );
};

export default FilterInput;
