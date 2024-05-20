import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/helper-plugin';
import { Config } from '../../../../server/admin-api/config';

import CopyLinkButton from '../../CopyLinkButton';

interface Props {
  path: string
}

const EditViewRightLinks: React.FC<Props> = ({ path }) => {
  const [url, setUrl] = useState<string>();
  const fetchClient = useFetchClient();

  useEffect(() => {
    fetchClient.get('/webtools/info/config')
      .then((response) => {
        const configData = response.data as Config;
        setUrl(configData.website_url);
      })
      .catch((error) => {
        console.error('Failed to fetch config:', error);
      });
  }, [fetchClient]);

  if (!url) return null;

  return <CopyLinkButton url={`${url}${path}`} />;
};

export default EditViewRightLinks;
