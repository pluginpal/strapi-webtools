import React from 'react';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';

import { ContentLayout, HeaderLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Link } from '@strapi/design-system/Link';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Button } from '@strapi/design-system/Button';
import { Stack } from '@strapi/design-system/Stack';
import { TextInput } from '@strapi/design-system/TextInput';
import { Textarea } from '@strapi/design-system/Textarea';
import { Typography } from '@strapi/design-system/Typography';
import Check from '@strapi/icons/Check';
import { GridItem, Grid } from '@strapi/design-system/Grid';

import getTrad from '../../../helpers/getTrad';
import schema from './utils/schema';

import pluginId from '../../../helpers/pluginId';
import CheckboxGroup from '../../../components/CheckboxGroup';

const CreatePattternPage = () => {
  const { formatMessage } = useIntl();

  const contentTypes = [
    {
      name: 'test',
      uid: 'space',
    },
    {
      name: 'testearr',
      uid: 'spaceasef',
    },
  ];

  const languages = [
    {
      name: 'NL',
      uid: 'nl',
    },
    {
      name: 'EN',
      uid: 'nl',
    },
  ];

  const handleEditRoleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ label: '', pattern: '', contentTypes: [], languages: [] }}
      onSubmit={handleEditRoleSubmit}
      validationSchema={schema}
    >
      {({ handleSubmit, values, handleChange, errors, touched, isSubmitting, setFieldValue }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <HeaderLayout
            title={formatMessage({ id: 'path.settings.page.patterns.title', defaultMessage: "Add new pattern" })}
            subtitle={formatMessage({ id: 'path.settings.page.patterns.title', defaultMessage: "Add a pattern for automatic URL alias generation." })}
            as="h2"
            navigationAction={(
              <Link startIcon={<ArrowLeft />} to={`/settings/${pluginId}/patterns`}>
                {formatMessage({
                  id: 'global.back',
                  defaultMessage: 'Back',
                })}
              </Link>
            )}
            primaryAction={(
              <Button type="submit" loading={isSubmitting} startIcon={<Check />}>
                {formatMessage({
                  id: 'global.save',
                  defaultMessage: 'Save',
                })}
              </Button>
            )}
          />
          <ContentLayout>
            <Stack spacing={7}>
              <Box
                background="neutral0"
                hasRadius
                shadow="filterShadow"
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Stack spacing={4}>
                  <Typography variant="delta" as="h2">
                    {formatMessage({
                      id: getTrad('EditPage.form.roles'),
                      defaultMessage: 'Pattern details',
                    })}
                  </Typography>
                  <Grid gap={4}>
                    <GridItem col={6}>
                      <TextInput
                        name="label"
                        value={values.label || ''}
                        onChange={handleChange}
                        label={formatMessage({
                          id: 'global.name',
                          defaultMessage: 'Name',
                        })}
                        error={
                          errors.label && touched.label
                            ? formatMessage({ id: errors.label, defaultMessage: 'Invalid value' })
                            : null
                        }
                      />
                    </GridItem>
                    <GridItem col={12} />
                    <GridItem col={6}>
                      <TextInput
                        name="pattern"
                        value={values.pattern || ''}
                        onChange={handleChange}
                        label={formatMessage({
                          id: 'global.name',
                          defaultMessage: 'Pattern',
                        })}
                        error={
                          errors.pattern && touched.pattern
                            ? formatMessage({ id: errors.pattern, defaultMessage: 'Invalid value' })
                            : null
                        }
                      />
                    </GridItem>
                    <GridItem col={12} />
                    <GridItem col={6}>
                      <CheckboxGroup
                        title="Content types"
                        list={contentTypes}
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        fieldName="contentTypes"
                      />
                    </GridItem>
                    <GridItem col={12} />
                    <GridItem col={6}>
                      <CheckboxGroup
                        title="Languages"
                        list={languages}
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        fieldName="languages"
                      />
                    </GridItem>
                  </Grid>
                </Stack>
              </Box>
            </Stack>
          </ContentLayout>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePattternPage;
