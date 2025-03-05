import React from 'react';
import { useIntl } from 'react-intl';
import {
  Formik,
  Form,
  FormikConfig,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import {
  Box,
  Link,
  Button,
  Typography,
  Grid,
  Loader,
} from '@strapi/design-system';
import { useNotification, getFetchClient, Layouts } from '@strapi/strapi/admin';
import { ArrowLeft, Check } from '@strapi/icons';
import schema from './utils/schema';
import { ErrorResponse } from '../../../types/error-response';
import pluginId from '../../../helpers/pluginId';
import Center from '../../../components/Center';
import Select from '../../../components/Select';
import PatternField from '../../../components/PatternField';
import { PatternFormValues, ValidatePatternResponse } from '../../../types/url-patterns';
import { EnabledContentTypes } from '../../../types/enabled-contenttypes';
import LanguageCheckboxes from '../../../components/LanguageCheckboxes';
import HiddenLocalizedField from '../../../components/HiddenLocalizedField';

const CreatePatternPage = () => {
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const { get, post } = getFetchClient();
  const contentTypes = useQuery('content-types', async () => get<EnabledContentTypes>('/webtools/info/getContentTypes'));
  const { formatMessage } = useIntl();

  const handleCreateSubmit: FormikConfig<any>['onSubmit'] = async (
    values: PatternFormValues,
    { setSubmitting },
  ) => {
    try {
      // Proceed to create the new pattern
      await post('/webtools/url-pattern/create', {
        data: {
          pattern: values.pattern,
          languages: values.languages,
          contenttype: values.contenttype,
        },
      });

      navigate(`/plugins/${pluginId}/patterns`);
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: 'webtools.settings.success.create' }),
      });
      setSubmitting(false);
    } catch (err) {
      toggleNotification({
        type: 'warning',
        message: formatMessage({ id: 'notification.error' }),
      });
      setSubmitting(false);
    }
  };

  const validatePattern = async (values: PatternFormValues) => {
    const errors = {};

    await post<ValidatePatternResponse>('/webtools/url-pattern/validate', {
      pattern: values.pattern,
      modelName: values.contenttype,
    })
      .then((res) => {
        const response = res.data;
        if (response.valid === false) {
          // @ts-ignore
          errors.pattern = response.message;
        }
      })
      .catch((err: ErrorResponse) => {
        console.error(err, 'Error in create validate pattern');
      });

    return errors;
  };

  if (contentTypes.isLoading || !contentTypes.data) {
    return (
      <Center>
        <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>
      </Center>
    );
  }

  const getSelectedContentType = (uid: string) => {
    const selectedContentType = contentTypes.data.data.find((type) => type.uid === uid);
    return selectedContentType;
  };

  return (
    <Formik<PatternFormValues>
      enableReinitialize
      initialValues={{
        pattern: '', contenttype: '', languages: [], localized: false,
      }}
      onSubmit={handleCreateSubmit}
      validationSchema={schema}
      validate={validatePattern}
      validateOnChange={false}
    >
      {({
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
      }) => (
        <>
          {/** @ts-ignore */}
          <Form noValidate onSubmit={handleSubmit}>
            <Layouts.Header
              title={formatMessage({
                id: 'webtools.settings.page.patterns.create.title',
                defaultMessage: 'Add new pattern',
              })}
              subtitle={formatMessage({
                id: 'webtools.settings.page.patterns.create.description',
                defaultMessage: 'Add a pattern for automatic URL alias generation.',
              })}
              navigationAction={(
                <Link startIcon={<ArrowLeft />} href={`/admin/plugins/${pluginId}/patterns`}>
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
            <Layouts.Content>
              <Box
                background="neutral0"
                hasRadius
                shadow="filterShadow"
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Typography variant="delta">
                  {formatMessage({
                    id: 'webtools.settings.page.patterns.create.subtitle',
                    defaultMessage: 'Pattern details',
                  })}
                </Typography>
                <Grid.Root gap={4} marginTop={4}>
                  <Grid.Item col={6} direction="column" alignItems="flex-start" gap="4">
                    <Select
                      name="contenttype"
                      list={contentTypes.data.data}
                      value={values.contenttype || ''}
                      setFieldValue={setFieldValue}
                      label={formatMessage({
                        id: 'webtools.settings.form.contenttype.label',
                        defaultMessage: 'Content type',
                      })}
                      error={
                        errors.contenttype && touched.contenttype
                          ? formatMessage({ id: String(errors.contenttype), defaultMessage: 'Invalid value' })
                          : null
                      }
                    />
                    {(values.contenttype !== '') && (
                      <PatternField
                        values={values}
                        uid={values.contenttype}
                        setFieldValue={setFieldValue}
                        error={
                          errors.pattern && touched.pattern
                            ? errors.pattern
                            : null
                        }
                      />
                    )}
                    <HiddenLocalizedField
                      localized={getSelectedContentType(values.contenttype)?.localized}
                      setFieldValue={setFieldValue}
                    />
                    {values.localized && (
                      <LanguageCheckboxes
                        onChange={(newLanguages) => setFieldValue('languages', newLanguages)}
                        selectedLanguages={values.languages}
                        error={
                          errors.languages && touched.languages
                            ? errors.languages
                            : null
                        }
                      />
                    )}
                  </Grid.Item>
                </Grid.Root>
              </Box>
            </Layouts.Content>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default CreatePatternPage;
