import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useCMEditViewDataManager, request } from '@strapi/helper-plugin';
import { Box } from '@strapi/design-system/Box';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import { TextInput } from '@strapi/design-system/TextInput';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Link } from '@strapi/design-system/Link';
import { Loader } from '@strapi/design-system/Loader';

import getTrad from '../../helpers/getTrad';

const EditView = () => {
  const [pathEntity, setPathEntity] = useState({});
  const [loading, setLoading] = useState(false);
  const { formatMessage } = useIntl();
  const { slug, modifiedData, onChange } = useCMEditViewDataManager();

  useEffect(() => {
    if (Number(modifiedData.path_id)) {
      setLoading(true);
      request(`/path/get/${modifiedData.path_id}`, { method: 'GET' })
        .then((res) => {
          setPathEntity(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [modifiedData.updatedAt, modifiedData.path_id]);

  return (
    <Box
      as="aside"
      aria-labelledby="path-sidebar-title"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      padding={4}
      paddingTop={6}
      shadow="tableShadow"
    >
      <Typography textColor="neutral600" variant="sigma" id="path-sidebar-title">
        {formatMessage({ id: getTrad('plugin.name'), defaultMessage: 'Path plugin' })}
      </Typography>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>
      <Stack size={2}>
        {loading ? (
          <Box>
            <Loader>Loading content...</Loader>
          </Box>
        ) : (
          <Box>
            <Box>
              <Checkbox
                onValueChange={(value) => {
                  onChange({ target: { name: 'path_generated', value } });
                  if (!('path_value' in modifiedData)) {
                    onChange({ target: { name: 'path_value', value: pathEntity.path } });
                  }
                }}
                value={'path_generated' in modifiedData ? modifiedData.path_generated : ('generated' in pathEntity ? pathEntity.generated : true)}
                name="generated"
                hint="Uncheck this to create a custom alias below."
              >
                {formatMessage({ id: getTrad('EditView.ExcludeFromSitemap'), defaultMessage: ' Generate automatic path alias' })}
              </Checkbox>
              <Link to="https://strapi.io/">Configure path alias patterns.</Link>
            </Box>
            <Box paddingTop={4}>
              <TextInput
                label="Path alias"
                name="path"
                hint='Specify an alternative path by which this data can be accessed. For example, type "/about" when writing an about page.'
                disabled={'path_generated' in modifiedData ? modifiedData.path_generated : ('generated' in pathEntity ? pathEntity.generated : true)}
                onChange={(e) => onChange({ target: { name: 'path_value', value: e.target.value } })}
                value={modifiedData.path_value || pathEntity.path}
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default EditView;
