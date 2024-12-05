import * as React from 'react';
import { Route } from 'react-router-dom';
import App from '../../containers/App';

const AdminRoute = () => {
  return (
    <Route
      path="/plugins/webtools/sitemap"
      element={<App />}
    />
  );
};

export default AdminRoute;
