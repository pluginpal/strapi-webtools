import React from 'react';
import {
  Routes,
  Route,
  useLocation,
  Link,
} from 'react-router-dom';

import { useIntl } from 'react-intl';
import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavSection,
  SubNavLink,
} from '@strapi/design-system';
import {
  useStrapiApp,
  Layouts,
  useRBAC,
} from '@strapi/strapi/admin';

import pluginPermissions from '../../permissions';
import pluginId from '../../helpers/pluginId';
import List from '../../screens/List';
import Overview from '../../screens/Overview';
import PatternsListPage from '../../screens/Patterns/ListPage';
import PatternsEditPage from '../../screens/Patterns/EditPage';
import PatternsCreatePage from '../../screens/Patterns/CreatePage';
import PageNotFound from '../../screens/404';
import { InjectedRoute } from '../../types/injection-zones';

const App = () => {
  const getPlugin = useStrapiApp('MyComponent', (state) => state.getPlugin);
  const {
    allowedActions: { canList, canPatterns, canOverview },
  } = useRBAC(pluginPermissions);
  const { formatMessage } = useIntl();

  const plugin = getPlugin(pluginId);

  const routerComponents = plugin?.getInjectedComponents('webtoolsRouter', 'route') as unknown as InjectedRoute[];

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Layouts.Root
      sideNav={(
        <SubNav>
          <SubNavHeader value="" label="Webtools" />
          <SubNavSections>
            <SubNavSection label="Core">
              {canOverview && (
                <SubNavLink tag={Link} to="/plugins/webtools" key="overview" className={currentPath === '/plugins/webtools' ? 'active' : ''}>
                  {formatMessage({ id: 'webtools.settings.page.overview.title', defaultMessage: 'Overview' })}
                </SubNavLink>
              )}
              {canList && (
                <SubNavLink tag={Link} to="/plugins/webtools/urls" key="list" className={currentPath.startsWith('/plugins/webtools/urls') ? 'active' : ''}>
                  {formatMessage({ id: 'webtools.settings.page.list.title', defaultMessage: 'All URLs' })}
                </SubNavLink>
              )}
              {canPatterns && (
                <SubNavLink tag={Link} to="/plugins/webtools/patterns" key="patterns" className={currentPath.startsWith('/plugins/webtools/patterns') ? 'active' : ''}>
                  {formatMessage({ id: 'webtools.settings.page.patterns.title', defaultMessage: 'URL patterns' })}
                </SubNavLink>
              )}
            </SubNavSection>
            {routerComponents.length > 0 && (
              <SubNavSection label="Addons">
                {routerComponents.map(({ path, label }) => (
                  <SubNavLink tag={Link} to={`/plugins/webtools${path}`} key={path} className={currentPath.startsWith(`/plugins/webtools${path}`) ? 'active' : ''}>
                    {label}
                  </SubNavLink>
                ))}
              </SubNavSection>
            )}
          </SubNavSections>
        </SubNav>
      )}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/urls" element={<List />} />
        <Route path="/patterns" element={<PatternsListPage />} />
        <Route path="/patterns/new" element={<PatternsCreatePage />} />
        <Route path="/patterns/:id" element={<PatternsEditPage />} />
        {routerComponents.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Layouts.Root>
  );
};

export default App;
