#!/usr/bin/env node
/**
 * Environment variable validation script (Task 44)
 * Fails with explicit message if required variables are missing.
 */
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.warn('[check-env] Warning: .env file not found at project root. Using current process env only.');
}

const required = [
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

const missing = required.filter((k) => !process.env[k] || process.env[k] === '');
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const placeholderPattern = /(YOUR_|\{\})/i;
const placeholders = required.filter((k) => placeholderPattern.test(String(process.env[k])));
if (placeholders.length) {
  console.warn(`[check-env] Placeholder values detected for: ${placeholders.join(', ')}`);
}

console.log('Environment variables OK');
