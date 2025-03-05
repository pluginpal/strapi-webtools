import * as React from 'react';
import { Route } from 'react-router-dom';
import App from '../App';

const SitemapRoute = () => {
  return <Route path="/sitemap" element={<App />} />;
};

export default SitemapRoute;
