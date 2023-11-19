import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';

import {
  ContentLayout,
  HeaderLayout,
  Box,
  Link,
  Button,
  Stack,
  Typography,
  GridItem,
  Grid,
  Loader,
} from '@strapi/design-system';
import { ArrowLeft, Check } from '@strapi/icons';
import { request, useNotification } from '@strapi/helper-plugin';

import schema from './utils/schema';

import pluginId from '../../../helpers/pluginId';
import Center from '../../../components/Center';
import Select from '../../../components/Select';
import LabelField from '../../../components/LabelField';
import PatternField from '../../../components/PatternField';

const CreatePattternPage = () => {
  const { push } = useHistory();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [contentTypes, setContentTypes] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setLoading(true);
    request('/webtools/info/getContentTypes', { method: 'GET' })
      .then((res: any) => {
        setContentTypes(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleCreateSubmit = (values: any, { setSubmitting, setErrors }: any) => {
    request('/webtools/pattern/create', {
      method: 'POST',
      body: JSON.stringify({
        data: values,
      }),
    })
      .then((res: any) => {
        push(`/settings/${pluginId}/patterns`);
        toggleNotification({ type: 'success', message: { id: 'webtools.settings.success.create' } });
        setSubmitting(false);
      })
      .catch((err: any) => {
        if (err.response.payload[0].message === 'This attribute must be unique') {
          setErrors({ code: err.response.payload[0].message });
        } else {
          toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
        }
        setSubmitting(false);
      });
  };

  const validatePattern = async (values: any) => {
    const errors: any = {};

    await request('/webtools/pattern/validate', {
      method: 'POST',
      body: JSON.stringify({
        pattern: values.pattern,
        modelName: values.contenttype,
      }),
    })
      .then((res: any) => {
        if (res.valid === false) {
          errors.pattern = res.message;
        }
      })
      .catch(() => {
      });

    return errors;
  };

  if (loading || !contentTypes) {
    return (
      <Center>
        <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>
      </Center>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        label: '', pattern: '', contenttype: '', languages: [],
      }}
      onSubmit={handleCreateSubmit}
      validationSchema={schema}
      validate={validatePattern}
    >
      {({
        handleSubmit, values, handleChange, errors, touched, isSubmitting, setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <HeaderLayout
            title={formatMessage({ id: 'webtools.settings.page.patterns.create.title', defaultMessage: 'Add new pattern' })}
            subtitle={formatMessage({ id: 'webtools.settings.page.patterns.create.description', defaultMessage: 'Add a pattern for automatic URL alias generation.' })}
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
                      id: 'settings.page.patterns.create.subtitle',
                      defaultMessage: 'Pattern details',
                    })}
                  </Typography>
                  <Grid gap={4}>
                    <GridItem col={6}>
                      <Select
                        name="contenttype"
                        list={contentTypes}
                        value={values.contenttype || ''}
                        setFieldValue={setFieldValue}
                        label={formatMessage({
                          id: 'settings.form.contenttype.label',
                          defaultMessage: 'Content type',
                        })}
                        error={
                          errors.contenttype && touched.contenttype
                            ? formatMessage({ id: String(errors.contenttype), defaultMessage: 'Invalid value' })
                            : null
                        }
                      />
                    </GridItem>
                    <GridItem col={12} />
                    <GridItem col={6}>
                      <LabelField
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        hint={(code: any) => (
                          <Typography>Machine name: {code} </Typography>
                        )}
                      />
                    </GridItem>
                    <GridItem col={12} />
                    {(values.contenttype !== '') && (
                    <GridItem col={6}>
                      <PatternField
                        values={values}
                        uid={values.contenttype}
                        setFieldValue={setFieldValue}
                        hint={(hint: any) => (
                          <Typography variant="pi">{hint}</Typography>
                        )}
                        error={
                            errors.pattern && touched.pattern
                              ? errors.pattern
                              : null
                          }
                      />
                    </GridItem>
                    )}
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
