import * as React from 'react';
import { useIntl } from "react-intl";

import { useCMEditViewDataManager } from "@strapi/helper-plugin";

import {
  Box,
  Stack,
  TextInput,
  Checkbox,
  Link,
} from "@strapi/design-system";

import getTrad from "../../helpers/getTrad";

const EditForm = () => {
  const { modifiedData, onChange } = useCMEditViewDataManager();
  const { formatMessage } = useIntl();

  const updateValue = (name: string, value: any) => {
    onChange({ target: { name: `url_alias.${name}`, value } });
  };

  return (
    <Stack size={2}>
      <Box>
        <Box>
          <Checkbox
            onValueChange={(value: any) => {
              updateValue("generated", value);
            }}
            value={modifiedData.url_alias.generated !== undefined ? modifiedData.url_alias.generated : true}
            name="generated"
            hint="Uncheck this to create a custom alias below."
          >
            {formatMessage({
              id: getTrad("EditView.ExcludeFromSitemap"),
              defaultMessage: " Generate automatic URL alias",
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
            disabled={modifiedData.url_alias.generated !== undefined ? modifiedData.url_alias.generated : true}
            onChange={async (e: any) => {
              if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                updateValue("url_path", e.target.value);
              }
            }}
            value={modifiedData.url_alias?.url_path}
          />
        </Box>
      </Box>
    </Stack>
  );
}

export default EditForm;
