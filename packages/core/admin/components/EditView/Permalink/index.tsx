import React, { useEffect, useState } from 'react';
import { request } from '@strapi/helper-plugin';
import { Config } from '../../../../server/admin-api/config';

import CopyLinkButton from '../../CopyLinkButton';

interface Props {
  path: string
}

const EditViewRightLinks: React.FC<Props> = ({ path }) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    request('/webtools/info/config', { method: 'GET' })
      .then((res: Config) => {
        setUrl(res.website_url);
      })
      .catch(() => {
      });
  }, []);

  if (!url) return null;

  return <CopyLinkButton url={`${url}${path}`} />;
};

export default EditViewRightLinks;
