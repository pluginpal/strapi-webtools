import React from 'react';
import { Routes, Route } from 'react-router-dom';

import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavSection,
  SubNavLink,
} from '@strapi/design-system';
import { Page, useStrapiApp, Layouts } from '@strapi/strapi/admin';


import pluginPermissions from '../../permissions';
import pluginId from '../../helpers/pluginId';
import Patterns from '../../screens/Patterns';
import List from '../../screens/List';
import Overview from '../../screens/Overview';

const App = () => {
  const getPlugin = useStrapiApp('MyComponent', (state) => state.getPlugin);

  const plugin = getPlugin(pluginId);
  console.log(plugin);
  const sidebarComponents = plugin?.getInjectedComponents('webtoolsSidebar', 'link');
  const routerComponents = plugin?.getInjectedComponents('webtoolsRouter', 'route');


  // if (history.location.pathname === `/plugins/${pluginId}`) {
  //   history.replace(`/plugins/${pluginId}/overview`);
  // }

  return (
    <Page.Protect permissions={pluginPermissions['settings.patterns']}>
      <Layouts.Root
        sideNav={(
          <SubNav>
            <SubNavHeader value="" label="Webtools" />
            <SubNavSections>
              <SubNavSection label="Core">
                <SubNavLink href="/admin/plugins/webtools/overview" key="test">
                  Overview
                </SubNavLink>
                <SubNavLink href="/admin/plugins/webtools/urls" key="test">
                  All URLs
                </SubNavLink>
                <SubNavLink href="/admin/plugins/webtools/patterns" key="test">
                  Url Patterns
                </SubNavLink>
              </SubNavSection>
              <SubNavSection label="Addons">
                {sidebarComponents.map(({ Component }) => <Component />)}
                {/* <SubNavLink to="/test" active key="test">
                  Sitemap
                </SubNavLink> */}
              </SubNavSection>
            </SubNavSections>
          </SubNav>
        )}
      >
        <Routes>
          <Route path="/overview" element={<Overview />} />
          <Route path="/urls" element={<List />} />
          <Route
            path="/patterns"
            element={<Patterns />}
          />
          {routerComponents.map(({ Component }) => {
            console.log(Component);
            return (
              <Route
                path={Component.path}
                element={<Component.element />}
              />
            );
            // @ts-ignore
            // eslint-disable-next-line react/jsx-pascal-case
            return <Component.type />;
          })}
          {/* <Route path="" component={NotFound} /> */}
        </Routes>
      </Layouts.Root>
    </Page.Protect>
  );
};

export default App;
