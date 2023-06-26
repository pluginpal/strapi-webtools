import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Formik, Form } from "formik";
import { useRouteMatch, useHistory } from "react-router-dom";

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
} from "@strapi/design-system";
import { request, useNotification } from "@strapi/helper-plugin";
import { ArrowLeft, Check } from "@strapi/icons";

import schema from "./utils/schema";

import pluginId from "../../../helpers/pluginId";
import Center from "../../../components/Center";
import Select from "../../../components/Select";
import LabelField from "../../../components/LabelField";
import PatternField from "../../../components/PatternField";

const EditPatternPage = () => {
  const { push } = useHistory();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [patternEntity, setPatternEntity] = useState<null | any>(null);
  const [contentTypes, setContentTypes] = useState([]);
  const { formatMessage } = useIntl();

  const {
    params: { id },
  } = useRouteMatch<{ id: string }>(`/settings/${pluginId}/patterns/:id`)!;

  useEffect(() => {
    setLoading(true);
    request(`/url-alias/info/getContentTypes`, { method: "GET" })
      .then((res: any) => {
        setContentTypes(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    request(`/url-alias/pattern/findOne/${id}`, { method: "GET" })
      .then((res: any) => {
        setPatternEntity(res);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleEditSubmit = (
    values: any,
    { setSubmitting, setErrors }: any = {},
  ) => {
    request(`/url-alias/pattern/update/${patternEntity.id}`, {
      method: "POST",
      body: {
        data: values,
      },
    })
      .then((res: any) => {
        push(`/settings/${pluginId}/patterns`);
        toggleNotification({
          type: "success",
          message: { id: "url-alias.settings.success.edit" },
        });
        setSubmitting(false);
      })
      .catch((err: any) => {
        if (
          err.response.payload[0].message === "This attribute must be unique"
        ) {
          setErrors({ code: err.response.payload[0].message });
        } else {
          toggleNotification({
            type: "warning",
            message: { id: "notification.error" },
          });
        }
        setSubmitting(false);
      });
  };

  const validatePattern = async (values: any) => {
    const errors: Record<string, any> = {};

    await request(`/url-alias/pattern/validate`, {
      method: "POST",
      body: {
        pattern: values.pattern,
        modelName: values.contenttype,
      },
    })
      .then((res: any) => {
        if (res.valid === false) {
          errors.pattern = res.message;
        }
      })
      .catch(() => { });

    return errors;
  };

  if (loading || !contentTypes || !patternEntity) {
    return (
      <Center>
        <Loader>
          {formatMessage({
            id: "url-alias.settings.loading",
            defaultMessage: "Loading content...",
          })}
        </Loader>
      </Center>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        label: patternEntity.label,
        pattern: patternEntity.pattern,
        contenttype: patternEntity.contenttype,
        languages: patternEntity.languages,
        code: patternEntity.code,
      }}
      onSubmit={handleEditSubmit}
      validationSchema={schema}
      validate={validatePattern}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <HeaderLayout
            title={formatMessage({
              id: "url-alias.settings.page.patterns.edit.title",
              defaultMessage: "Edit pattern",
            })}
            subtitle={formatMessage({
              id: "url-alias.settings.page.patterns.edit.description",
              defaultMessage:
                "Edit this pattern for automatic URL alias generation.",
            })}
            as="h2"
            navigationAction={(
              <Link
                startIcon={<ArrowLeft />}
                to={`/settings/${pluginId}/patterns`}
              >
                {formatMessage({
                  id: "global.back",
                  defaultMessage: "Back",
                })}
              </Link>
            )}
            primaryAction={(
              <Button
                type="submit"
                loading={isSubmitting}
                startIcon={<Check />}
              >
                {formatMessage({
                  id: "global.save",
                  defaultMessage: "Save",
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
                      id: "settings.page.patterns.edit.subtitle",
                      defaultMessage: "Pattern details",
                    })}
                  </Typography>
                  <Grid gap={4}>
                    <GridItem col={6}>
                      <Select
                        name="contenttype"
                        list={contentTypes}
                        value={values.contenttype || ""}
                        setFieldValue={setFieldValue}
                        label={formatMessage({
                          id: "settings.form.contenttype.label",
                          defaultMessage: "Content type",
                        })}
                        error={
                          errors.contenttype && touched.contenttype
                            ? formatMessage({
                              id:
                                typeof errors.contenttype === "string"
                                  ? errors.contenttype
                                  : undefined,
                              defaultMessage: "Invalid value",
                            })
                            : null
                        }
                      />
                    </GridItem>
                    <GridItem col={12} />
                    <GridItem col={12} />
                    <GridItem col={6}>
                      <LabelField
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        hint={(code) => (
                          <Typography>Machine name: {code} </Typography>
                        )}
                      />
                    </GridItem>
                    <GridItem col={12} />
                    {values.contenttype !== "" && (
                      <GridItem col={6}>
                        <PatternField
                          values={values}
                          uid={values.contenttype}
                          setFieldValue={setFieldValue}
                          hint={(hint) => (
                            <Typography variant="pi">{hint}</Typography>
                          )}
                          error={
                            errors.pattern
                              && touched.pattern
                              && typeof errors.pattern === "string"
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

export default EditPatternPage;
