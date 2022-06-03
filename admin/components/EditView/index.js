import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

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
  const { modifiedData, onChange } = useCMEditViewDataManager();

  useEffect(() => {
    if (Number(modifiedData.path_id)) {
      setLoading(true);
      request(`/url-alias/findOne/${modifiedData.path_id}`, { method: 'GET' })
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
      aria-labelledby="url-alias-sidebar-title"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      padding={4}
      paddingTop={6}
      shadow="tableShadow"
    >
      <Typography textColor="neutral600" variant="sigma" id="url-alias-sidebar-title">
        {formatMessage({ id: getTrad('plugin.name'), defaultMessage: 'URL alias' })}
      </Typography>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>
      <Stack size={2}>
        {loading ? (
          <Box>
            <Loader>{formatMessage({ id: 'url-alias.settings.loading', defaultMessage: "Loading content..." })}</Loader>
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
                {formatMessage({ id: getTrad('EditView.ExcludeFromSitemap'), defaultMessage: ' Generate automatic URL alias' })}
              </Checkbox>
              <Link to="/settings/url-alias/patterns">Configure URL alias patterns.</Link>
            </Box>
            <Box paddingTop={4}>
              <TextInput
                label="URL alias"
                name="path"
                hint='Specify a path by which this data can be accessed in the browser. For example, type "/about" when writing an about page.'
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
