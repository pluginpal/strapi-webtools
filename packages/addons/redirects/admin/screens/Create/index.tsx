import React from 'react';
import { useIntl } from 'react-intl';
import {
  useMutation,
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

import { Link, useNavigate } from 'react-router-dom';

import pluginPermissions from '../../permissions';
import RedirectForm, { RedirectFormValues } from '../../components/RedirectForm';

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

const Create = () => {
  const { post } = getFetchClient();
  const { toggleNotification } = useNotification();
  const { _unstableFormatValidationErrors: formatValidationErrors } = useAPIErrorHandler();
  const [errors, setErrors] = React.useState<{ [key: string]: string } | null>(null);
  const navigate = useNavigate();

  const { formatMessage } = useIntl();

  const mutation = useMutation(
    (values: RedirectFormValues) => post('/webtools/redirects', { data: values }),
    {
      onSuccess: () => {
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools-addon-redirects.settings.success.create', defaultMessage: 'The redirect was successfully created.' }) });
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

  const handleSubmit = (values: RedirectFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Page.Protect permissions={pluginPermissions['settings.create']}>
      <Layouts.Header
        title={formatMessage({ id: 'webtools-addon-redirects.settings.page.create.title', defaultMessage: 'Create a Redirect' })}
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
            remoteErrors={errors}
            handleSubmit={handleSubmit}
          />
        </Box>
      </Layouts.Content>
    </Page.Protect>
  );
};

export default Create;
