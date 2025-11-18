import { useParams } from 'react-router-dom';
import * as React from 'react';
import Providers from '../../containers/Providers';
import Settings from '../../containers/Settings';

const SitemapSettings = () => {
  const { id } = useParams();

  return (
    <Providers>
      <Settings id={id} />
    </Providers>
  );
};

export default SitemapSettings;
