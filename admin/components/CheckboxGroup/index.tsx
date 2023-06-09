import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { Checkbox, Box, Typography } from '@strapi/design-system';

type Props = {
  values: any;
  setFieldValue: any;
  title: string;
  list: any[];
  errors: Record<string, any>;
  touched: any;
  fieldName: string;
}

const CheckboxGroup: FC<Props> = ({ values, setFieldValue, title, list, errors, touched, fieldName }) => {
  const { formatMessage } = useIntl();

  if (!list || list.length < 0) {
    return null;
  }

  return (
    <div>
      <Box paddingBottom={2}>
        <Typography variant="omega" fontWeight="semiBold">
          {title}
        </Typography>
      </Box>
      {list.map((item, i) => (
        <Box key={item.uid} paddingBottom={1}>
          <Checkbox
            onValueChange={() => {
              const index = values.contentTypes.indexOf(item.uid);
              const newArray = values.contentTypes;

              if (index >= 0) {
                newArray.splice(index, 1);
              } else {
                newArray.push(item.uid);
              }

              setFieldValue(fieldName, newArray);
            }}
            name={fieldName}
            value={values.contentTypes.indexOf(item.uid) >= 0}
            error={
              errors[fieldName] && touched[fieldName] && list.length === i + 1
                ? formatMessage({ id: errors[fieldName], defaultMessage: 'Invalid value' })
                : null
            }
          >
            {item.name}
          </Checkbox>
        </Box>
      ))}
    </div>
  );
};

export default CheckboxGroup;
