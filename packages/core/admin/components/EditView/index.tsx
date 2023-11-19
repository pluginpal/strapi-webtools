import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useCMEditViewDataManager, request } from '@strapi/helper-plugin';
import {
  Box,
  Divider,
  Typography,
  Stack,
  TextInput,
  Checkbox,
  Link,
  Loader,
  Icon,
  Flex,
} from '@strapi/design-system';
import { Play } from '@strapi/icons';

import Permalink from './Permalink';
import getTrad from '../../helpers/getTrad';

const EditView = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [contentTypes, setContentTypes] = useState([]);
  const { formatMessage } = useIntl();
  const { modifiedData, onChange, slug } = useCMEditViewDataManager();

  const hasPath = !!Number(modifiedData.url_path_id);
  const { data: pathEntity = {}, isLoading: isQueryLoading } = useQuery<any>(
    ['webtools', 'findOne', modifiedData.url_path_id, modifiedData.updatedAt],
    () => request(`/webtools/findOne/${modifiedData.url_path_id}`, {
      method: 'GET',
    }),
    {
      enabled: hasPath,
    },
  );

  useEffect(() => {
    request('/webtools/info/getContentTypes', { method: 'GET' })
      .then((res: any) => {
        setContentTypes(res);
      })
      .catch(() => {
      });
  }, []);

  const isLoading = hasPath ? isQueryLoading : false;

  if (!contentTypes) return null;
  if (!contentTypes.find((type) => type.uid === slug)) return null;

  return (
    <>
      <Box
        as="aside"
        aria-labelledby="webtools-sidebar-title"
        background="neutral0"
        borderColor="neutral150"
        hasRadius
        padding={4}
        shadow="tableShadow"
        onClick={() => !opened && setOpened(true)}
      >
        <Flex onClick={() => opened && setOpened(false)}>
          <Typography
            textColor="neutral600"
            variant="sigma"
            id="webtools-sidebar-title"
          >
            {formatMessage({
              id: getTrad('plugin.name'),
              defaultMessage: 'URL alias',
            })}
          </Typography>
          <Icon
            width="0.5rem"
            height="0.5rem"
            as={Play}
            transform={!opened ? 'rotate(90deg)' : 'rotate(-90deg)'}
            marginLeft="auto"
          />
        </Flex>
        {opened && (
          <>
            <Box paddingTop={2} paddingBottom={6}>
              <Divider />
            </Box>
            <Stack size={2}>
              {isLoading ? (
                <Box>
                  <Loader>
                    {formatMessage({
                      id: 'webtools.settings.loading',
                      defaultMessage: 'Loading content...',
                    })}
                  </Loader>
                </Box>
              ) : (
                <Box>
                  <Box>
                    <Checkbox
                      onValueChange={(value: any) => {
                        onChange({ target: { name: 'path_generated', value } });
                        if (!('path_value' in modifiedData)) {
                          onChange({
                            target: {
                              name: 'path_value',
                              value: pathEntity.url_path,
                            },
                          });
                        }
                      }}
                      value={
                        'path_generated' in modifiedData
                          ? modifiedData.path_generated
                          : 'generated' in pathEntity
                            ? pathEntity.generated
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
                        'path_generated' in modifiedData
                          ? modifiedData.path_generated
                          : 'generated' in pathEntity
                            ? pathEntity.generated
                            : true
                      }
                      onChange={async (e: any) => {
                        if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                          onChange({
                            target: { name: 'path_value', value: e.target.value },
                          });
                        }
                      }}
                      value={
                        'path_value' in modifiedData
                          ? modifiedData.path_value
                          : pathEntity.url_path
                      }
                    />
                  </Box>
                </Box>
              )}
            </Stack>
          </>
        )}
      </Box>
      <Permalink
        path={
          'path_value' in modifiedData
            ? modifiedData.path_value
            : pathEntity.url_path
        }
      />
    </>
  );
};

export default EditView;
