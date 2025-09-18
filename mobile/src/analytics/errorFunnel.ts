// Centralized error funnel utility
// Emits standardized analytics error events (pr_error) adhering to strict param schema.
import { track } from './index';

type ErrorSurface = 'purchase' | 'auth' | 'paywall' | 'startup' | 'network' | 'unknown';

type ErrorCode =
  | 'purchase_fail'
  | 'restore_fail'
  | 'no_package'
  | 'auth_fail'
  | 'network_timeout'
  | 'unexpected'
  | 'init_fail';

export async function recordError(code: ErrorCode, surface: ErrorSurface) {
  try {
    await track('pr_error', { code, surface });
  } catch { /* swallow */ }
}
