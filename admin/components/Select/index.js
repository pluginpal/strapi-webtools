import React from 'react';
import { Select, Option } from '@strapi/design-system/Select';

const SelectComponent = ({
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
      onChange={(v) => {
        console.log(v);
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
