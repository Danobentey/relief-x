import { AnalyticsEventName, analyticsEventParamMap, AnalyticsEventParams, AnalyticsDispatchOptions } from './events';

// Simple in-memory recorder for tests / dev verification
const _recordedEvents: { name: AnalyticsEventName; params: AnalyticsEventParams; timestamp: number }[] = [];

export interface AnalyticsProvider {
  track: (name: AnalyticsEventName, params?: AnalyticsEventParams) => Promise<void> | void;
  flush?: () => Promise<void> | void;
}

let provider: AnalyticsProvider | null = null;
let strictMode = true; // Task D: enforce no unexpected params by default

export function setAnalyticsProvider(p: AnalyticsProvider) {
  provider = p;
}

export function setAnalyticsStrictMode(enabled: boolean) {
  strictMode = enabled;
}

export function getRecordedEvents() {
  return [..._recordedEvents];
}

function validateParams(name: AnalyticsEventName, params?: AnalyticsEventParams) {
  const required = analyticsEventParamMap[name];
  const providedKeys = Object.keys(params || {});
  // Check required keys existence
  const missing = required.filter((k) => !providedKeys.includes(k));
  if (missing.length) {
    throw new Error(`Analytics validation failed: missing param(s) ${missing.join(', ')} for event ${name}`);
  }
  if (strictMode) {
    const unexpected = providedKeys.filter((k) => !required.includes(k));
    if (unexpected.length) {
      throw new Error(`Analytics validation failed: unexpected param(s) ${unexpected.join(', ')} for event ${name}`);
    }
  }
}

export async function track(
  name: AnalyticsEventName,
  params?: AnalyticsEventParams,
  opts?: AnalyticsDispatchOptions
) {
  validateParams(name, params);
  const payload = params || {};
  _recordedEvents.push({ name, params: payload, timestamp: Date.now() });
  if (!opts?.silent) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(`[analytics] ${name}`, payload);
    }
  }
  if (provider) {
    await provider.track(name, payload);
  }
}

export function resetAnalyticsTestState() {
  _recordedEvents.length = 0;
}
