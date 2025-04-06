import React from 'react';
import { getFetchClient } from '@strapi/strapi/admin';
import { useQuery } from 'react-query';

import CopyLinkButton from '../../CopyLinkButton';
import { Config } from '../../../../server/config';

interface Props {
  path: string
}

const EditViewRightLinks: React.FC<Props> = ({ path }) => {
  const { get } = getFetchClient();
  const config = useQuery('config', async () => get<Config>('/webtools/info/config'));

  if (config.isLoading || config.isError || !config.data.data.website_url) return null;

  return <CopyLinkButton url={`${config.data.data.website_url}${path}`} />;
};

export default EditViewRightLinks;
