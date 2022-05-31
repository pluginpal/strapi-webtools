/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CheckPagePermissions } from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';
import ConfigPage from '../ConfigPage';

const App = () => {
  const queryClient = new QueryClient();

  return (
    <CheckPagePermissions permissions={pluginPermissions.settings}>
      <QueryClientProvider client={queryClient}>
        <ConfigPage />
      </QueryClientProvider>
    </CheckPagePermissions>
  );
};

export default App;
