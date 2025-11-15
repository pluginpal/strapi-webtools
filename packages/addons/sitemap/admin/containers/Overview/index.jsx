import { Box, Button } from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { List } from 'immutable';
import { getFetchClient, Layouts, useNotification } from '@strapi/strapi/admin';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import TableComponent from './components/Table';
import { getSettings, getSitemaps } from '../../state/actions/Sitemap';
import NewSitemapModal from '../../components/NewSitemapModal';

const Overview = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [ready, setReady] = React.useState(false);

  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();

  const { get } = getFetchClient();

  useEffect(() => {
    get('/webtools/sitemap/init')
      .then(() => setReady(true))
      .catch(() => navigate('/plugins/webtools/sitemap/default', { state: { backButton: false } }));
  }, []);

  useEffect(() => {
    dispatch(getSettings(toggleNotification, formatMessage, get));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  if (!ready) {
    return null;
  }

  return (
    <Box background="neutral100">
      <Layouts.Header
        primaryAction={(
          <NewSitemapModal>
            <Button startIcon={<Plus />}>
              {formatMessage({
                id: 'sitemap.Overview.Header.Button',
                defaultMessage: 'Create new sitemap',
              })}
            </Button>
          </NewSitemapModal>
        )}
        title={`${formatMessage({ id: 'sitemap.Overview.Header.Title', defaultMessage: 'Sitemaps' })}`}
        subtitle={formatMessage({ id: 'sitemap.Overview.Header.Description', defaultMessage: 'A list of all the available sitemaps' })}
      />
      <Layouts.Content>
        <TableComponent />
      </Layouts.Content>
    </Box>
  );
};

export default Overview;
