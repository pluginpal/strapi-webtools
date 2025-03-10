import * as React from 'react';

import { EmptyStateLayout, LinkButton } from '@strapi/design-system';
import { Layouts } from '@strapi/strapi/admin';

import { EmptyDocuments } from '@strapi/icons/symbols';
import { ArrowRight } from '@strapi/icons';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

const PageNotFound = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Layouts.Header
        title={formatMessage({ id: 'webtools.settings.page.404.title', defaultMessage: 'Page not found' })}
      />
      <Layouts.Content>
        <EmptyStateLayout
          content="Oops! We can't seem to find the page you're looking for..."
          icon={<EmptyDocuments width="16rem" />}
          action={<LinkButton variant="secondary" tag={Link} to="/plugins/webtools" endIcon={<ArrowRight />}>Back to homepage</LinkButton>}
          shadow="tableShadow"
          hasRadius
        />
      </Layouts.Content>
    </>
  );
};

export default PageNotFound;
