import { useRef, useEffect, useCallback } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

interface TelemetryConfig {
  endpoint: string;
  enabled: boolean;
  installationId: string;
  tenantId: string;
  pluginVersion: string;
  environment: string;
}

interface UseTelemetryReturn {
  trackEvent: (eventType: string, properties?: Record<string, any>) => void;
}

/**
 * Hook that provides a fire-and-forget `trackEvent` function for client-side telemetry.
 * Fetches telemetry config from the server and sends events directly via fetch.
 */
const useTelemetry = (): UseTelemetryReturn => {
  const { get } = useFetchClient();
  const configRef = useRef<TelemetryConfig | null>(null);
  const sessionIdRef = useRef<string>(globalThis.crypto.randomUUID());

  useEffect(() => {
    get<TelemetryConfig>('/webtools/telemetry/config')
      .then(({ data }) => {
        configRef.current = data;
      })
      .catch(() => {
        // best-effort: telemetry is optional
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackEvent = useCallback((eventType: string, properties: Record<string, any> = {}) => {
    const config = configRef.current;
    if (!config?.enabled) return;

    const event = {
      event_id: globalThis.crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event_type: eventType,
      tenant_id: config.tenantId,
      installation_id: config.installationId,
      session_id: sessionIdRef.current,
      plugin_name: 'webtools',
      plugin_version: config.pluginVersion,
      strapi_version: 'unknown',
      node_version: 'browser',
      environment: config.environment,
      properties,
    };

    fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PluginPal-Tenant': config.tenantId,
        'X-PluginPal-Installation': config.installationId,
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {
      // fire-and-forget: swallow errors
    });
  }, []);

  return { trackEvent };
};

export default useTelemetry;
