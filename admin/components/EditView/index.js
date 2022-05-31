import React from 'react';
import { useIntl } from 'react-intl';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Box } from '@strapi/design-system/Box';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { TextInput } from '@strapi/design-system/TextInput';

import getTrad from '../../helpers/getTrad';

const EditView = () => {
  const { formatMessage } = useIntl();
  const { slug, modifiedData, onChange } = useCMEditViewDataManager();

  return (
    <Box paddingTop={6}>
      <Typography textColor="neutral600" variant="sigma">
        {formatMessage({ id: getTrad('plugin.name'), defaultMessage: 'Path plugin' })}
      </Typography>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>
      <Stack size={2}>
        <Box>
          <TextInput
            placeholder="This is a content placeholder"
            label="Content"
            name="content"
            hint="Description line"
            onChange={(e) => onChange({ target: { name: 'path_id', value: e.target.value } })}
            value={modifiedData.path_id}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default EditView;
