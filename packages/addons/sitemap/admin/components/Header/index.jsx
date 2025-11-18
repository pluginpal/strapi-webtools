import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';

import { useNotification, getFetchClient, Layouts } from '@strapi/strapi/admin';
import { Box, Button, Link as DsLink } from '@strapi/design-system';
import { Check, ArrowLeft } from '@strapi/icons';
import { Link } from 'react-router-dom';

import { discardAllChanges, submit } from '../../state/actions/Sitemap';

const Header = ({ id, backButton }) => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings', 'sitemaps', id], Map()));
  const initialData = useSelector((state) => state.getIn(['sitemap', 'initialData'], Map()));
  const { toggleNotification } = useNotification();
  const { put } = getFetchClient();

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const disabled = JSON.stringify(settings) === JSON.stringify(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submit(id, settings.toJS(), toggleNotification, formatMessage, put));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(discardAllChanges(id));
  };

  return (
    <Box background="neutral100">
      <Layouts.Header
        navigationAction={backButton && (
          <DsLink startIcon={<ArrowLeft />} tag={Link} to="/plugins/webtools/sitemap">
            {formatMessage({
              id: 'global.back',
              defaultMessage: 'Back',
            })}
          </DsLink>
        )}
        primaryAction={(
          <Box style={{ display: 'flex' }}>
            <Button
              onClick={handleCancel}
              disabled={disabled}
              variant="secondary"
            >
              {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleSubmit}
              disabled={disabled}
              type="submit"
              startIcon={<Check />}
            >
              {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
            </Button>
          </Box>
        )}
        title={`${formatMessage({ id: 'sitemap.Header.Title', defaultMessage: 'Sitemap' })} - ${id}`}
        subtitle={formatMessage({ id: 'sitemap.Header.Description', defaultMessage: 'Settings for the sitemap XML' })}
      />
    </Box>
  );
};

export default Header;
