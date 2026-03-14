import { Core } from '@strapi/strapi';
import { TelemetryClient } from '@pluginpal/plugin-telemetry';

// Plugin version - update this when releasing new versions
const PLUGIN_VERSION = '1.8.0';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    // Initialize telemetry
    try {
      // Get Strapi's UUID (from strapi.uuid in package.json)
      const strapiUuid = strapi.config.get('uuid');
      if (!strapiUuid) {
        throw new Error('Strapi UUID not found in config');
      }

      const telemetry = new TelemetryClient({
        endpoint: process.env.PLUGINPAL_TELEMETRY_ENDPOINT ||
                  'https://admin.pluginpal.io/v1/ingest/events',
        tenantId: process.env.WEBTOOLS_LICENSE_KEY || 'anonymous',
        installationId: strapiUuid,
        pluginName: 'webtools',
        pluginVersion: PLUGIN_VERSION,
        enabled: strapi.config.get('plugin::webtools.telemetry_enabled', true),
        environment: process.env.NODE_ENV,
      });

      // Store telemetry on global strapi object for access from middlewares/services
      (global as any).webtoolsTelemetry = telemetry;
      (global as any).webtoolsPluginVersion = PLUGIN_VERSION;

      strapi.log.info(`Webtools telemetry: ${telemetry.isEnabled() ? 'enabled' : 'disabled'}`);
    } catch (error) {
      strapi.log.error('Webtools telemetry initialization failed', error);
    }

    // Register permission actions.
    const actions = [
      {
        section: 'plugins',
        displayName: 'Access the overview page',
        uid: 'settings.overview',
        pluginName: 'webtools',
      },
      {
        section: 'plugins',
        displayName: 'Access the URL alias list',
        uid: 'settings.list',
        pluginName: 'webtools',
      },
      {
        section: 'plugins',
        displayName: 'Access the URL alias patterns',
        uid: 'settings.patterns',
        pluginName: 'webtools',
      },
      {
        section: 'plugins',
        displayName: 'Access the URL alias sidebar',
        uid: 'edit-view.sidebar',
        pluginName: 'webtools',
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (strapi.admin.services.permission.actionProvider.registerMany as (a: any) => void)(actions);
  } catch (error) {
    strapi.log.error(`Bootstrap failed. ${String(error)}`);
  }
};
