import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useCMEditViewDataManager, request } from '@strapi/helper-plugin';
import { Box } from '@strapi/design-system/Box';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { TextInput } from '@strapi/design-system/TextInput';
import { Checkbox } from '@strapi/design-system/Checkbox';

import getTrad from '../../helpers/getTrad';

const EditView = () => {
  const { formatMessage } = useIntl();
  const { slug, modifiedData, onChange } = useCMEditViewDataManager();

  const { isLoading, error, data } = useQuery('repoData', () => {
    if (Number(modifiedData.path_id)) {
      return request(`/path/get/${modifiedData.path_id}`, { method: 'GET' })
        .then((res) => res)
        .catch((err) => err);
    }
  });

   if (isLoading) return 'Loading...';

   if (error) return `An error has occurred: ${error.message}`;

   // Initiate the overridden_path field.
   onChange({ target: { name: 'overridden_path', value: !data.generated } });

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
            disabled={!data.generated && !modifiedData.overridden_path || !modifiedData.overridden_path}
            onChange={(e) => onChange({ target: { name: 'overridden_path_value', value: e.target.value } })}
            value={modifiedData.overridden_path_value || data.path}
          />
          <Checkbox
            onValueChange={(value) => {
              onChange({ target: { name: 'overridden_path', value } });
              if (value) {
                onChange({ target: { name: 'overridden_path_value', value: data.path } });
              } else {
                onChange({ target: { name: 'overridden_path_value', value: null } });
              }
            }}
            value={modifiedData.overridden_path}
            name="generated"
          >
            {formatMessage({ id: getTrad('EditView.ExcludeFromSitemap'), defaultMessage: 'Exclude from sitemap' })}
          </Checkbox>
        </Box>
      </Stack>
    </Box>
  );
};

export default EditView;
