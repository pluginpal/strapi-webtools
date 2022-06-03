import React from 'react';
import { useIntl } from 'react-intl';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';

const CheckboxGroup = ({ values, setFieldValue, title, list, errors, touched, fieldName }) => {
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
