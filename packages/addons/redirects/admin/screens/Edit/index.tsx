import React from 'react';
import { useIntl } from 'react-intl';
import {
  useMutation,
  useQuery,
} from 'react-query';

import {
  Box,
  Link as DsLink,
} from '@strapi/design-system';

import {
  Page,
  getFetchClient,
  Layouts,
  useNotification,
  useAPIErrorHandler,
} from '@strapi/strapi/admin';

import { ArrowLeft } from '@strapi/icons';
import type { errors } from '@strapi/utils';

import { Link, useNavigate, useParams } from 'react-router-dom';

import pluginPermissions from '../../permissions';
import RedirectForm, { RedirectFormValues } from '../../components/RedirectForm';
import { GenericResponse } from '../../types/content-api';
import { Redirect } from '../../types/redirect';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type ApiError =
  | errors.ApplicationError
  | errors.ForbiddenError
  | errors.NotFoundError
  | errors.NotImplementedError
  | errors.PaginationError
  | errors.PayloadTooLargeError
  | errors.PolicyError
  | errors.RateLimitError
  | errors.UnauthorizedError
  | errors.ValidationError
  | errors.YupValidationError;

const Edit = () => {
  const { get, put } = getFetchClient();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { _unstableFormatValidationErrors: formatValidationErrors } = useAPIErrorHandler();
  const [errors, setErrors] = React.useState<{ [key: string]: string } | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const redirect = useQuery(['redirect', id], async () => get<GenericResponse<Redirect>>(`/webtools/redirects/${id}`));

  const mutation = useMutation(
    (values: RedirectFormValues) => put(`/webtools/redirects/${id}`, { data: values }),
    {
      onSuccess: () => {
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools-addon-redirects.settings.success.edit', defaultMessage: 'The redirect was successfully updated.' }) });
        navigate('/plugins/webtools/redirects');
      },
      onError: (error) => {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const apiError = error.response?.data?.error as ApiError;

        toggleNotification({
          type: 'danger',
          message:
            apiError?.message ||
            formatMessage({
              id: 'notification.error',
              defaultMessage: 'An unexpected error occurred',
            }),
        });

        if (
          apiError?.name === 'ValidationError'
        ) {
          setErrors(formatValidationErrors(apiError));
        }
      },
    },
  );

  if (redirect.isLoading) {
    return (
      <Page.Loading />
    );
  }

  if (redirect.isError) {
    return (
      <Page.Error />
    );
  }

  const handleSubmit = (values: RedirectFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Page.Protect permissions={pluginPermissions['settings.edit']}>
      <Layouts.Header
        title={formatMessage({ id: 'webtools-addon-redirects.settings.page.edit.title', defaultMessage: 'Update Redirect' })}
        navigationAction={(
          <DsLink startIcon={<ArrowLeft />} tag={Link} to="/plugins/webtools/redirects">
            {formatMessage({
              id: 'global.back',
              defaultMessage: 'Back',
            })}
          </DsLink>
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
          <RedirectForm
            handleSubmit={handleSubmit}
            remoteErrors={errors}
            defaultValues={{
              from: redirect.data.data.data.from,
              to: redirect.data.data.data.to,
              status_code: redirect.data.data.data.status_code,
            }}
          />
        </Box>
      </Layouts.Content>
    </Page.Protect>
  );
};

export default Edit;
