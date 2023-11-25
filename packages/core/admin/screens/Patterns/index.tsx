import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CheckPagePermissions } from '@strapi/helper-plugin';
import pluginId from '../../helpers/pluginId';
import pluginPermissions from '../../permissions';
import PatternsListPage from './ListPage';
import PatternsEditPage from './EditPage';
import PatternsCreatePage from './CreatePage';

const Patterns = () => (
  <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
    <Switch>
      <Route
        path={`/settings/${pluginId}/patterns/new`}
        component={PatternsCreatePage}
        exact
      />
      <Route path={`/settings/${pluginId}/patterns/:id`} component={PatternsEditPage} exact />
      <Route path={`/settings/${pluginId}/patterns`} component={PatternsListPage} exact />
      {/* <Route path="" component={NotFound} /> */}
    </Switch>
  </CheckPagePermissions>
);

export default Patterns;
