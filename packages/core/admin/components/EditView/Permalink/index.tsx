import React, { useEffect, useState } from 'react';
import { request } from '@strapi/helper-plugin';

import CopyLinkButton from '../../CopyLinkButton';

const EditViewRightLinks = ({ path }) => {
  const [url, setUrl] = useState();

  useEffect(() => {
    request(`/webtools/info/config`, { method: 'GET' })
      .then((res: any) => {
        setUrl(res.website_url);
      })
      .catch(() => {
      });
  }, []);

  if (!url) return null;

  return <CopyLinkButton url={`${url}${path}`} />;
};

export default EditViewRightLinks;
