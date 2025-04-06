import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import type { PanelComponent } from '@strapi/content-manager/strapi-admin';
import {
  unstable_useContentManagerContext,
  useFetchClient,
  useRBAC,
  useStrapiApp,
} from '@strapi/strapi/admin';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { isContentTypeEnabled } from '../../../server/util/enabledContentTypes';
import { UrlAliasEntity } from '../../types/url-aliases';
import pluginPermissions from '../../permissions';
import pluginId from '../../helpers/pluginId';
import { InjectedRoute } from '../../types/injection-zones';

const WebtoolsPanel: PanelComponent = () => {
  const { get } = useFetchClient();
  const getPlugin = useStrapiApp('MyComponent', (state) => state.getPlugin);
  const {
    allowedActions: { canSidebar },
  } = useRBAC(pluginPermissions);
  const context = unstable_useContentManagerContext();
  const {
    contentType,
    model,
    id,
  } = context;

  const plugin = getPlugin(pluginId);

  const injectedLinks = plugin?.getInjectedComponents('webtoolsSidePanel', 'link') as unknown as InjectedRoute[];

  const urlParams = new URLSearchParams(window.location.search);
  const locale = urlParams.get('plugins[i18n][locale]');
  const aliases = useQuery(`aliases-${model}-${id}-${locale}`, async () => get<UrlAliasEntity[]>(`/webtools/url-alias/findFrom?model=${model}&documentId=${id}&locale=${locale}`), { enabled: false });

  /**
   * Ideally the url_alias field would be hidden, but doing so will cause an issue.
   * The issue can be prevented by setting the field to visible. To make sure the user
   * doesn't see the url_alias field, we just remove it from the dom.
   *
   * @see https://github.com/strapi/strapi/issues/23039
   * @see https://github.com/strapi/strapi/issues/22975
   */
  useEffect(() => {
    const label = Array.from(document.querySelectorAll('label')).find((l) => l.textContent.startsWith('url_alias'));
    if (label) {
      let parentDiv = label.closest('div');
      for (let i = 0; i < 2; i++) {
        if (parentDiv) {
          // @ts-expect-error
          parentDiv = parentDiv.parentElement;
        }
      }
      if (parentDiv) {
        parentDiv.remove();
      }
    }
  }, []);

  // Early return if the user has no permissions to view the sidebar.
  if (!canSidebar) return null;

  // @ts-expect-error
  // Early return if the content type is not enabled.
  if (!isContentTypeEnabled(contentType)) return null;

  // Fetch the aliases
  if (aliases.isIdle) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    aliases.refetch();
  }

  // Early return for loading, error and empty states.
  if (aliases.isLoading) return null;
  if (aliases.error) return null;
  if (!aliases.data) return null;

  return {
    title: 'Webtools',
    content: (
      <>
        <EditForm />
        {aliases.data.data.length === 0 && (
          <div>Save the form to generate the URL alias</div>
        )}
        {aliases.data.data.length > 0 && (
          <Permalink
            path={aliases.data.data[0].url_path}
          />
        )}
        {injectedLinks.map(({ Component }) => (
          <Component />
        ))}
      </>
    ),
  };
};

export default WebtoolsPanel;
