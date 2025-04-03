import { translatedErrors } from '@strapi/admin/strapi-admin';
import { getFetchClient } from '@strapi/strapi/admin';
import isEmpty from 'lodash/isEmpty';

import {
  Button,
  Field,
  Flex,
  SingleSelect,
  SingleSelectOption,
  TextInput,
} from '@strapi/design-system';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import * as yup from 'yup';
import { Config } from '../../../server/config';

export type RedirectFormValues = {
  from: string;
  to: string;
  status_code: number;
};

type Props = {
  handleSubmit: (values: RedirectFormValues) => void;
  defaultValues?: RedirectFormValues;
  remoteErrors?: { [key: string]: string }
};

const possibleStatusCodes = [
  300,
  301,
  302,
  303,
  304,
  305,
  306,
  307,
  308,
];

const RedirectForm = (props: Props) => {
  const {
    handleSubmit,
    defaultValues,
    remoteErrors,
  } = props;

  const { formatMessage } = useIntl();
  const { get } = getFetchClient();
  const data = useQuery('config', async () => get<Config>('/webtools/redirects/config'));

  return (
    <Formik<RedirectFormValues>
      initialValues={defaultValues || { from: '', to: '', status_code: data.data?.data?.default_status_code }}
      validationSchema={yup.object().shape({
        from: yup.string().required(translatedErrors.required.defaultMessage),
        to: yup.string().required(translatedErrors.required.defaultMessage),
        status_code: yup.mixed().required(translatedErrors.required.defaultMessage),
      })}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange={false}
      initialErrors={remoteErrors}
    >
      {({
        setFieldValue,
        values,
        errors,
        setErrors,
        initialErrors,
      }) => {
        if (!isEmpty(errors)) {
          setErrors(errors);
        } else if (!isEmpty(initialErrors)) {
          setErrors(initialErrors);
        }

        return (
          <Form>
            <Flex gap={5} direction="column" alignItems="flex-start" maxWidth="500px">
              <Field.Root width="100%" required error={errors.from}>
                <Field.Label>
                  {formatMessage({ id: 'webtools-addon-redirects.form.from.label', defaultMessage: 'From' })}
                </Field.Label>
                <TextInput
                  name="from"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={(e) => setFieldValue('from', e.target.value)}
                  value={values.from}
                />
                <Field.Error />
              </Field.Root>
              <Field.Root width="100%" required error={errors.to}>
                <Field.Label>
                  {formatMessage({ id: 'webtools-addon-redirects.form.to.label', defaultMessage: 'To' })}
                </Field.Label>
                <TextInput
                  name="to"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={(e) => setFieldValue('to', e.target.value)}
                  value={values.to}
                />
                <Field.Error />
              </Field.Root>
              <Field.Root width="100%" required error={errors.status_code}>
                <Field.Label>
                  {formatMessage({ id: 'webtools-addon-redirects.form.status_code.label', defaultMessage: 'Status Code' })}
                </Field.Label>
                <SingleSelect
                  name="status_code"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={(value) => setFieldValue('status_code', value)}
                  value={values.status_code}
                >
                  {possibleStatusCodes.map((code) => (
                    <SingleSelectOption key={code} value={code}>
                      {formatMessage({ id: `webtools-addon-redirects.form.status_code.${code}`, defaultMessage: `${code}` })}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
                <Field.Error />
              </Field.Root>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <Button type="submit">
                {formatMessage({ id: 'webtools-addon-redirects.form.submit', defaultMessage: 'Save redirect' })}
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RedirectForm;
