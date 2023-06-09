import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "react-query";

import { useCMEditViewDataManager, request } from "@strapi/helper-plugin";
import {
  Box,
  Divider,
  Typography,
  Stack,
  TextInput,
  Checkbox,
  Link,
  Loader,
} from "@strapi/design-system";

import getTrad from "../../helpers/getTrad";

const EditView = () => {
  // const [pathEntity, setPathEntity] = useState({});
  const { formatMessage } = useIntl();
  const { modifiedData, onChange } = useCMEditViewDataManager();

  const { data: pathEntity, isLoading } = useQuery(
    ["url-alias", "findOne", modifiedData.url_path_id, modifiedData.updatedAt],
    () =>
      request(`/url-alias/findOne/${modifiedData.url_path_id}`, {
        method: "GET",
      })
  );

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
      <Typography
        textColor="neutral600"
        variant="sigma"
        id="url-alias-sidebar-title"
      >
        {formatMessage({
          id: getTrad("plugin.name"),
          defaultMessage: "URL alias",
        })}
      </Typography>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>
      <Stack size={2}>
        {isLoading ? (
          <Box>
            <Loader>
              {formatMessage({
                id: "url-alias.settings.loading",
                defaultMessage: "Loading content...",
              })}
            </Loader>
          </Box>
        ) : (
          <Box>
            <Box>
              <Checkbox
                onValueChange={(value: any) => {
                  onChange({ target: { name: "path_generated", value } });
                  if (!("path_value" in modifiedData)) {
                    onChange({
                      target: {
                        name: "path_value",
                        value: pathEntity.url_path,
                      },
                    });
                  }
                }}
                value={
                  "path_generated" in modifiedData
                    ? modifiedData.path_generated
                    : "generated" in pathEntity
                      ? pathEntity.generated
                      : true
                }
                name="generated"
                hint="Uncheck this to create a custom alias below."
              >
                {formatMessage({
                  id: getTrad("EditView.ExcludeFromSitemap"),
                  defaultMessage: " Generate automatic URL alias",
                })}
              </Checkbox>
              <Link to="/settings/url-alias/patterns">
                Configure URL alias patterns.
              </Link>
            </Box>
            <Box paddingTop={4}>
              <TextInput
                label="URL alias"
                name="path"
                hint='Specify a path by which this data can be accessed in the browser. For example, type "/about" when writing an about page.'
                disabled={
                  "path_generated" in modifiedData
                    ? modifiedData.path_generated
                    : "generated" in pathEntity
                      ? pathEntity.generated
                      : true
                }
                onChange={async (e: any) => {
                  if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                    onChange({
                      target: { name: "path_value", value: e.target.value },
                    });
                  }
                }}
                value={
                  "path_value" in modifiedData
                    ? modifiedData.path_value
                    : pathEntity.url_path
                }
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default EditView;
