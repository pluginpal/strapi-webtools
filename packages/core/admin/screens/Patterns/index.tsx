import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Page } from '@strapi/strapi/admin';
import pluginId from '../../helpers/pluginId';
import pluginPermissions from '../../permissions';
import PatternsListPage from './ListPage';
import PatternsEditPage from './EditPage';
import PatternsCreatePage from './CreatePage';

const Patterns = () => (
  <Page.Protect permissions={pluginPermissions['settings.patterns']}>
    <Routes>
      <Route
        path={`/plugins/${pluginId}/patterns/new`}
        element={<PatternsCreatePage />}
      />
      <Route path={`/plugins/${pluginId}/patterns/:id`} element={<PatternsEditPage />} />
      <Route path={`/plugins/${pluginId}/patterns`} element={<PatternsListPage />} />
      {/* <Route path="" component={NotFound} /> */}
    </Routes>
  </Page.Protect>
);

export default Patterns;
