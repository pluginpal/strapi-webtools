import React, { FC } from 'react';
import { Select, Option } from '@strapi/design-system';

type Props = {
  list?: any[];
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  value?: string;
  error?: string | null;
  setFieldValue: (name: string, value: string) => void;
}

const SelectComponent: FC<Props> = ({
  list,
  name,
  label,
  placeholder,
  hint,
  value,
  error,
  setFieldValue,
}) => {
  if (!list || list.length < 0) {
    return null;
  }

  return (
    <Select
      label={label}
      name={name}
      placeholder={placeholder}
      hint={hint}
      error={error}
      value={value}
      onChange={(v: any) => {
        setFieldValue(name, v);
      }}
    >
      {list.map((item) => (
        <Option key={item.uid} value={item.uid}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};

export default SelectComponent;
