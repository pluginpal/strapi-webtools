import * as React from 'react';
import { useIntl } from 'react-intl';

import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import {
  Box,
  Stack,
  TextInput,
  Checkbox,
  Link,
} from '@strapi/design-system';

import getTrad from '../../helpers/getTrad';
import { UrlAliasEntity } from '../../types/url-aliases';

const EditForm = () => {
  const { modifiedData, onChange } = useCMEditViewDataManager();
  const modifiedDataUrlAlias = modifiedData.url_alias as UrlAliasEntity;
  const { formatMessage } = useIntl();

  const updateValue = (name: string, value: string | number) => {
    onChange({ target: { name: `url_alias.${name}`, value } });
  };

  return (
    <Stack size={2}>
      <Box>
        <Box>
          <Checkbox
            onValueChange={(value: string) => {
              updateValue('generated', value);
            }}
            value={
              modifiedDataUrlAlias?.generated !== undefined
                ? modifiedDataUrlAlias?.generated
                : true
            }
            name="generated"
            hint="Uncheck this to create a custom alias below."
          >
            {formatMessage({
              id: getTrad('EditView.ExcludeFromSitemap'),
              defaultMessage: ' Generate automatic URL alias',
            })}
          </Checkbox>
          <Link to="/settings/webtools/patterns">
            Configure URL alias patterns.
          </Link>
        </Box>
        <Box paddingTop={4}>
          <TextInput
            label="URL alias"
            name="path"
            hint='Specify a path by which this data can be accessed in the browser. For example, type "/about" when writing an about page.'
            disabled={
              modifiedDataUrlAlias?.generated !== undefined
                ? modifiedDataUrlAlias?.generated
                : true
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                updateValue('url_path', e.target.value);
              }
            }}
            value={modifiedDataUrlAlias?.url_path}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default EditForm;
