import React from 'react';

import { Map } from 'immutable';
import { FormattedDate, FormattedTime, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { getFetchClient, useNotification } from '@strapi/strapi/admin';
import { Box, Button, Flex, Link, Typography } from '@strapi/design-system';

import { generateSitemap } from '../../state/actions/Sitemap';

const emptyMap = new Map();

const Info = () => {
  const hasHostname = useSelector((state) => state.getIn(['sitemap', 'initialData', 'hostname'], emptyMap));
  const sitemapInfo = useSelector((state) => state.getIn(['sitemap', 'info'], emptyMap));
  let [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { get } = getFetchClient();
  const { formatMessage } = useIntl();

  const updateTime = sitemapInfo.get('updateTime') ? new Date(sitemapInfo.get('updateTime')) : undefined;
  const numberOfSitemaps = sitemapInfo.get('sitemaps') ?? 0;

  const content = () => {
    if (!hasHostname) {
      return (
        <div>
          <Typography variant="delta" style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.NoHostname.Title', defaultMessage: 'Set your hostname' })}
          </Typography>
          <Flex direction="column" alignItems="flex-start">
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.NoHostname.Description', defaultMessage: 'Before you can generate the sitemap you have to specify the hostname of your website.' })}
            </Typography>
            <Button
              onClick={() => {
                setSearchParams({ tab: 'settings' });
                setTimeout(() => (document.querySelector('input[name="hostname"]')).focus(), 0);
              }}
              variant="secondary"
              style={{ marginTop: '15px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.GoToSettings', defaultMessage: 'Go to settings' })}
            </Button>
          </Flex>
        </div>
      );
    }

    if (!updateTime) {
      return (
        <div>
          <Typography variant="delta" style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.NoSitemap.Title', defaultMessage: 'No sitemap XML present' })}
          </Typography>
          <div>
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.NoSitemap.Description', defaultMessage: 'Generate your first sitemap XML with the button below.' })}
            </Typography>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Button
              onClick={() => dispatch(generateSitemap(toggleNotification, formatMessage, get))}
              variant="secondary"
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate', defaultMessage: 'Generate sitemap' })}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Typography variant="delta" style={{ marginBottom: '10px' }}>
          {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.Title', defaultMessage: 'Sitemap XML is present' })}
        </Typography>

        <div>
          <Typography variant="omega">
            {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.LastUpdatedAt', defaultMessage: 'Last updated at:' })}
          </Typography>
          <Typography variant="omega" fontWeight="bold" style={{ marginLeft: '5px' }}>
            <FormattedDate value={updateTime} /> <FormattedTime value={updateTime} />
          </Typography>
        </div>
        {numberOfSitemaps === 0 ? (
          <div>
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.AmountOfURLs', defaultMessage: 'Amount of URLs:' })}
            </Typography>
            <Typography variant="omega" fontWeight="bold" style={{ marginLeft: '5px' }}>
              {sitemapInfo.get('urls')}
            </Typography>
          </div>
        ) : (
          <div>
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.AmountOfSitemaps', defaultMessage: 'Amount of sitemaps:' })}
            </Typography>
            <Typography variant="omega" fontWeight="bold" style={{ marginLeft: '5px' }}>
              {numberOfSitemaps}
            </Typography>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '15px' }}>
          <Button
            onClick={() => dispatch(generateSitemap(toggleNotification, formatMessage, get))}
            variant="secondary"
            style={{ marginRight: '10px' }}
          >
            {formatMessage({ id: 'sitemap.Header.Button.Generate', defaultMessage: 'Generate sitemap' })}
          </Button>
          <Link
            href={`${strapi.backendURL}${sitemapInfo.get('location')}`}
            target="_blank"
          >
            {formatMessage({ id: 'sitemap.Header.Button.SitemapLink', defaultMessage: 'Go to the sitemap' })}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Box paddingLeft={8} paddingRight={8}>
      <Box
        background="neutral0"
        hasRadius
        paddingTop={4}
        paddingBottom={4}
        paddingLeft={5}
        paddingRight={5}
        shadow="filterShadow"
      >
        {content()}
      </Box>
    </Box>
  );
};

export default Info;
