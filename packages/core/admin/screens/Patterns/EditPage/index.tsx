import React from 'react';
import { useIntl } from 'react-intl';
import { Formik, Form, FormikProps } from 'formik';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Link as DsLink,
  Button,
  Flex,
  Typography,
  Grid,
  Loader,
} from '@strapi/design-system';
import { useNotification, getFetchClient, Layouts } from '@strapi/strapi/admin';
import { ArrowLeft, Check } from '@strapi/icons';
import { ErrorResponse } from '../../../types/error-response';
import schema from './utils/schema';
import pluginId from '../../../helpers/pluginId';
import Center from '../../../components/Center';
import Select from '../../../components/Select';
import PatternField from '../../../components/PatternField';
import { PatternEntity, PatternFormValues, ValidatePatternResponse } from '../../../types/url-patterns';
import { EnabledContentTypes } from '../../../types/enabled-contenttypes';
import HiddenLocalizedField from '../../../components/HiddenLocalizedField';
import LanguageCheckboxes from '../../../components/LanguageCheckboxes';
import { GenericResponse } from '../../../types/content-api';

const EditPatternPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toggleNotification } = useNotification();
  const { get, put, post } = getFetchClient();
  const pattern = useQuery(['url-pattern', id], async () => get<GenericResponse<PatternEntity>>(`/webtools/url-pattern/findOne/${id}`));
  const contentTypes = useQuery('content-types', async () => get<EnabledContentTypes>('/webtools/info/getContentTypes'));
  const { formatMessage } = useIntl();

  const handleEditSubmit = async (
    values: PatternFormValues,
    { setSubmitting }: FormikProps<PatternFormValues>,
  ) => {
    try {
      // Proceed to update the current pattern
      await put(`/webtools/url-pattern/update/${pattern.data.data.data.documentId}`, {
        data: {
          pattern: values.pattern,
          languages: values.languages,
          contenttype: values.contenttype,
        },
      });

      navigate(`/plugins/${pluginId}/patterns`);
      toggleNotification({
        type: 'success',
        message: formatMessage({ id: 'webtools.settings.success.edit' }),
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
    const errors: Record<string, any> = {};

    await post('/webtools/url-pattern/validate', {
      pattern: values.pattern,
      modelName: values.contenttype,
    })
      .then((res) => {
        const response = res.data as unknown as ValidatePatternResponse;
        if (response.valid === false) {
          errors.pattern = response.message;
        }
      })
      .catch((err: ErrorResponse) => {
        console.error(err, 'Error in edit validate pattern');
      });

    return errors;
  };

  if (pattern.isLoading || contentTypes.isLoading) {
    return (
      <Center>
        <Loader>
          {formatMessage({
            id: 'webtools.settings.loading',
            defaultMessage: 'Loading content...',
          })}
        </Loader>
      </Center>
    );
  }

  const getSelectedContentType = (uid: string) => {
    const selectedContentType = contentTypes.data.data.filter(
      (type) => type.uid === uid,
    )[0];

    return selectedContentType;
  };

  return (
    <Formik<PatternFormValues>
      enableReinitialize
      initialValues={{
        pattern: pattern.data.data.data.pattern,
        contenttype: pattern.data.data.data.contenttype,
        languages: pattern.data.data.data.languages,
        localized: false,
      }}
      onSubmit={handleEditSubmit}
      validationSchema={schema}
      validate={validatePattern}
    >
      {({
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Layouts.Header
            title={formatMessage({
              id: 'webtools.settings.page.patterns.edit.title',
              defaultMessage: 'Edit pattern',
            })}
            subtitle={formatMessage({
              id: 'webtools.settings.page.patterns.edit.description',
              defaultMessage:
                'Edit this pattern for automatic URL alias generation.',
            })}
            navigationAction={(
              <DsLink
                tag={Link}
                startIcon={<ArrowLeft />}
                to={`/plugins/${pluginId}/patterns`}
              >
                {formatMessage({
                  id: 'global.back',
                  defaultMessage: 'Back',
                })}
              </DsLink>
            )}
            primaryAction={(
              <Button
                type="submit"
                loading={isSubmitting}
                startIcon={<Check />}
              >
                {formatMessage({
                  id: 'global.save',
                  defaultMessage: 'Save',
                })}
              </Button>
            )}
          />
          <Layouts.Content>
            <Flex>
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
                    id: 'webtools.settings.page.patterns.edit.subtitle',
                    defaultMessage: 'Pattern details',
                  })}
                </Typography>
                <Grid.Root gap={4} marginTop="4">
                  <Grid.Item col={6} gap="4" alignItems="flex-start" direction="column">
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
                          ? formatMessage({
                            id:
                              typeof errors.contenttype === 'string'
                                ? errors.contenttype
                                : undefined,
                            defaultMessage: 'Invalid value',
                          })
                          : null
                      }
                    />
                    {values.contenttype !== '' && (
                      <PatternField
                        values={values}
                        uid={values.contenttype}
                        setFieldValue={setFieldValue}
                        error={
                            errors.pattern
                            && touched.pattern
                            && typeof errors.pattern === 'string'
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
            </Flex>
          </Layouts.Content>
        </Form>
      )}
    </Formik>
  );
};

export default EditPatternPage;
