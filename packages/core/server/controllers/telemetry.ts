import { Context } from 'koa';

/**
 * Telemetry config controller
 * Exposes non-sensitive telemetry configuration to the admin UI.
 */
export default {
  getConfig: (ctx: Context) => {
    const telemetry = (global as any).webtoolsTelemetry;

    ctx.body = {
      endpoint: process.env.PLUGINPAL_TELEMETRY_ENDPOINT || 'https://admin.pluginpal.io/v1/ingest/events',
      enabled: telemetry ? telemetry.isEnabled() : false,
      installationId: strapi.config.get('uuid') || 'unknown',
      tenantId: process.env.WEBTOOLS_LICENSE_KEY || 'anonymous',
      pluginVersion: (global as any).webtoolsPluginVersion || 'unknown',
      environment: process.env.NODE_ENV || 'production',
    };
  },
};
