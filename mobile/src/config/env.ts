// Centralized environment access
// Mirrors required vars enforced by scripts/check-env.js

interface EnvShape {
  APP_ENV: string;
  FIREBASE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  SENTRY_DSN: string;
  REVENUECAT_API_KEY_PUBLIC: string;
  REVENUECAT_ENTITLEMENT_ID: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
}

function readEnv(): EnvShape {
  const required: (keyof EnvShape)[] = [
    'APP_ENV',
    'FIREBASE_API_KEY',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MESSAGING_SENDER_ID',
    'SENTRY_DSN',
    'REVENUECAT_API_KEY_PUBLIC',
    'REVENUECAT_ENTITLEMENT_ID',
    'GOOGLE_OAUTH_CLIENT_ID'
  ];
  const out: Partial<EnvShape> = {};
  for (const key of required) {
    const val = (process.env as Record<string,string|undefined>)[key];
    if (!val) {
      console.warn(`[env] Missing ${key}.`);
      out[key] = '' as unknown as EnvShape[typeof key];
    } else {
      out[key] = val as unknown as EnvShape[typeof key];
    }
  }
  return out as EnvShape;
}

export const env = readEnv();
