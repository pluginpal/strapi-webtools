/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { getFetchClient, useNotification } from '@strapi/strapi/admin';

import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import Info from '../../components/Info';

import {
  getContentTypes,
  getSettings,
  getSitemapInfo,
  getLanguages,
} from '../../state/actions/Sitemap';
import Loader from '../../components/Loader';

const Settings = ({ id }) => {
  const loading = useSelector((state) => state.getIn(['sitemap', 'loading'], false));
  const { formatMessage } = useIntl();
  const [backButton, setBackButton] = React.useState(false);

  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { get } = getFetchClient();

  useEffect(() => {
    get('/webtools/sitemap/init')
      .then(() => setBackButton(true))
      .catch(() => setBackButton(false));
  }, []);

  useEffect(() => {
    dispatch(getSettings(toggleNotification, formatMessage, get, id));
    dispatch(getLanguages(toggleNotification, formatMessage, get));
    dispatch(getContentTypes(toggleNotification, formatMessage, get));
    dispatch(getSitemapInfo(id, toggleNotification, formatMessage, get));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <Loader />}
      <Header id={id} backButton={backButton} />
      <Info id={id} />
      <Tabs id={id} />
    </div>
  );
};

export default Settings;
