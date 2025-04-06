import { InputProps, useField } from '@strapi/admin/strapi-admin';
import { Field, TextInput } from '@strapi/design-system';
import * as React from 'react';

import { useIntl } from 'react-intl';

const Input = (props: InputProps) => {
  const {
    hint, disabled, labelAction, label, name, required,
  } = props; // these are just some of the props passed by the content-manager
  const field = useField(name);

  const { formatMessage } = useIntl();

  const handleChange = (e) => {
    field.onChange(name, e.target.value);
  };

  console.log(label);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <Field.Root
      name={name}
      aria-disabled={disabled}
      onChange={handleChange}
      required={required}
    >
      <Field.Label>{label}</Field.Label>
      <Field.Input />
    </Field.Root>
  );
};

export default Input;
