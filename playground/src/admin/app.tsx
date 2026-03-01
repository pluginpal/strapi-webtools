import LinksOverview from '../../../packages/core/admin/screens/LinksOverview';

export default {
  register(app: any) {
    // Register Links addon overview screen
    const webtoolsPlugin = app.getPlugin('webtools');
    if (webtoolsPlugin) {
      webtoolsPlugin.injectComponent('webtoolsRouter', 'route', {
        path: '/links',
        Component: LinksOverview,
        label: 'Links',
      });
    }
  },
};
