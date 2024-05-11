import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import {
  Layout,
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavSection,
  SubNavLink,
} from '@strapi/design-system';
import { CheckPagePermissions } from '@strapi/helper-plugin';

import pluginPermissions from '../../permissions';
import pluginId from '../../helpers/pluginId';
import Patterns from '../../screens/Patterns';
import List from '../../screens/List';
import Overview from '../../screens/Overview';

const App = () => {
  const history = useHistory();

  if (history.location.pathname === `/plugins/${pluginId}`) {
    history.replace(`/plugins/${pluginId}/overview`);
  }

  return (
    <CheckPagePermissions permissions={pluginPermissions['settings.patterns']}>
      <Layout
        sideNav={(
          <SubNav ariaLabel="Webtools sub nav">
            <SubNavHeader value="" label="Webtools" />
            <SubNavSections>
              <SubNavSection label="Core">
                <SubNavLink to="/plugins/webtools/overview" key="test">
                  Overview
                </SubNavLink>
                <SubNavLink to="/plugins/webtools/urls" key="test">
                  All URLs
                </SubNavLink>
                <SubNavLink to="/plugins/webtools/patterns" key="test">
                  Url Patterns
                </SubNavLink>
              </SubNavSection>
              {/* <SubNavSection label="Addons">
                <SubNavLink to="/test" active key="test">
                  Sitemap
                </SubNavLink>
              </SubNavSection> */}
            </SubNavSections>
          </SubNav>
        )}
      >
        <Switch>
          <Route path={[`/plugins/${pluginId}/overview`, `/plugins/${pluginId}`]} component={Overview} exact />
          <Route path={`/plugins/${pluginId}/urls`} component={List} exact />
          <Route
            path={`/plugins/${pluginId}/patterns`}
            component={Patterns}
            exact
          />
          {/* <Route path="" component={NotFound} /> */}
        </Switch>
      </Layout>
    </CheckPagePermissions>
  );
};

export default App;
