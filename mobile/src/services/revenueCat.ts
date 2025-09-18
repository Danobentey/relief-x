// RevenueCat service abstraction (Task 35 - integration phase D/E)
// This isolates the RevenueCat SDK usage so the rest of the app depends only on this contract.

import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { db, auth } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { track } from '../analytics';
import { recordError } from '../analytics/errorFunnel';

// NOTE: Some SDK type gaps handled with minimal inline interfaces to avoid `any` proliferation.
interface CurrentOfferingLike {
  availablePackages: PurchasesPackage[];
}
interface OfferingsLike {
  current?: CurrentOfferingLike | null;
}

// Entitlement info minimal subset (SDK type name PurchasesEntitlementInfo)
interface EntitlementInfoLike {
  identifier: string;
  isActive: boolean;
  isSandbox: boolean;
  periodType: string; // e.g., NORMAL, INTRO, TRIAL
  expirationDate?: string | null;
  latestPurchaseDate?: string | null;
  productIdentifier: string;
}

export type SubscriptionPlan = 'monthly' | 'annual';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'grace' | 'unknown';

export interface EntitlementState {
  status: SubscriptionStatus;
  trialStartAt?: number; // epoch ms
  trialEndAt?: number;   // epoch ms
  updatedAt: number;     // last sync time
  productId?: string;
}

let currentEntitlement: EntitlementState = { status: 'unknown', updatedAt: Date.now() };
let configured = false;
let ENTITLEMENT_ID: string | undefined;

export interface RevenueCatInitOptions {
  apiKey: string; // public SDK key
  userId?: string; // optional app user id
  entitlementId: string; // expected entitlement identifier
  debug?: boolean;
}

export async function initRevenueCat(opts: RevenueCatInitOptions) {
  if (configured) return;
  ENTITLEMENT_ID = opts.entitlementId;
  Purchases.setLogLevel(opts.debug ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
  Purchases.configure({ apiKey: opts.apiKey, appUserID: auth.currentUser?.uid || opts.userId });
  configured = true;
  await syncEntitlements();
}

function extractActiveEntitlements(info: CustomerInfo): Record<string, EntitlementInfoLike> {
  const root: unknown = (info as unknown as { entitlements?: unknown }).entitlements;
  if (!root || typeof root !== 'object') return {};
  const active = (root as { active?: unknown }).active;
  if (!active || typeof active !== 'object') return {};
  const map: Record<string, EntitlementInfoLike> = {};
  for (const [key, value] of Object.entries(active as Record<string, unknown>)) {
    if (value && typeof value === 'object') {
      const v = value as Partial<EntitlementInfoLike>;
      if (typeof v.productIdentifier === 'string') {
        const isActiveUnknown: unknown = (v as { isActive?: unknown }).isActive;
        map[key] = {
          identifier: v.identifier || key,
          isActive: Boolean(isActiveUnknown),
          isSandbox: Boolean(v.isSandbox),
          periodType: String(v.periodType || ''),
          expirationDate: v.expirationDate || null,
          latestPurchaseDate: v.latestPurchaseDate || null,
          productIdentifier: v.productIdentifier,
        };
      }
    }
  }
  return map;
}

function mapCustomerInfo(info: CustomerInfo): EntitlementState {
  const entMap = extractActiveEntitlements(info);
  const ent = ENTITLEMENT_ID ? entMap[ENTITLEMENT_ID] : undefined;
  if (!ent) {
    return { status: 'expired', updatedAt: Date.now() };
  }
  const now = Date.now();
  const periodTypeLower = ent.periodType?.toLowerCase?.() || '';
  const isTrial = periodTypeLower === 'trial' || periodTypeLower === 'intro';
  const expMs = ent.expirationDate ? new Date(ent.expirationDate).getTime() : undefined;
  let status: SubscriptionStatus = 'active';
  if (isTrial) status = 'trial';
  if (expMs && expMs < now) status = 'expired';
  return {
    status,
    trialStartAt: isTrial && ent.latestPurchaseDate ? new Date(ent.latestPurchaseDate).getTime() : undefined,
    trialEndAt: isTrial && expMs ? expMs : undefined,
    updatedAt: now,
    productId: ent.productIdentifier,
  };
}

async function persistEntitlement(userId?: string) {
  if (!userId) return; // no user yet
  try {
    await setDoc(
      doc(db, 'users', userId),
      { subscriptionStatus: currentEntitlement.status, entitlementUpdatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    if (__DEV__) console.warn('[revenuecat] persist entitlement failed', e);
  }
}

export async function syncEntitlements(): Promise<EntitlementState> {
  try {
    const info = await Purchases.getCustomerInfo();
    currentEntitlement = mapCustomerInfo(info);
    // if anonymous original id differs from firebase auth uid, alias
    if (auth.currentUser && info.originalAppUserId !== auth.currentUser.uid) {
      try { await Purchases.logIn(auth.currentUser.uid); } catch { /* ignore */ }
    }
  } catch (_e) {
    if (currentEntitlement.status === 'unknown') {
      currentEntitlement = { status: 'unknown', updatedAt: Date.now() };
    } else {
      currentEntitlement = { ...currentEntitlement, updatedAt: Date.now() };
    }
  }
  const userId = auth.currentUser?.uid || (await Purchases.getCustomerInfo()).originalAppUserId;
  await persistEntitlement(userId);
  return currentEntitlement;
}

function findPackageForPlan(plan: SubscriptionPlan, offerings: OfferingsLike): PurchasesPackage | null {
  if (!offerings?.current) return null;
  const desired = plan === 'annual' ? 'annual' : 'monthly';
  for (const pkg of offerings.current.availablePackages) {
    const type: unknown = (pkg as unknown as { packageType?: unknown }).packageType;
    if (typeof type === 'string' && type.toLowerCase().includes(desired)) {
      return pkg;
    }
  }
  return null;
}

export async function startTrial(plan: SubscriptionPlan): Promise<EntitlementState> {
  return purchase(plan);
}

export async function purchase(plan: SubscriptionPlan): Promise<EntitlementState> {
  const rawOfferings: unknown = await Purchases.getOfferings();
  const offerings: OfferingsLike = ((): OfferingsLike => {
    if (rawOfferings && typeof rawOfferings === 'object') {
      const cur = (rawOfferings as { current?: unknown }).current;
      if (cur && typeof cur === 'object' && (cur as { availablePackages?: unknown }).availablePackages) {
        return { current: cur as CurrentOfferingLike };
      }
    }
    return {};
  })();
  const pkg = findPackageForPlan(plan, offerings);
  if (!pkg) {
    await recordError('no_package', 'purchase');
    throw new Error(`No package found for plan: ${plan}`);
  }
  try {
    const result = await Purchases.purchasePackage(pkg);
    currentEntitlement = mapCustomerInfo(result.customerInfo);
    await persistEntitlement(result.customerInfo.originalAppUserId);
    if (currentEntitlement.status === 'trial') {
      await track('pr_subscription_begin_trial', { plan });
    } else if (currentEntitlement.status === 'active') {
      await track('pr_subscription_convert', { plan });
    }
    return currentEntitlement;
  } catch (e) {
    await recordError('purchase_fail', 'purchase');
    throw e;
  }
}

export async function restore(): Promise<EntitlementState> {
  try {
    const info = await Purchases.restorePurchases();
    currentEntitlement = mapCustomerInfo(info);
    await persistEntitlement(info.originalAppUserId);
    await track('pr_subscription_convert', { plan: 'restore' });
    return currentEntitlement;
  } catch (e) {
    await recordError('restore_fail', 'purchase');
    throw e;
  }
}

export function getEntitlement(): EntitlementState {
  return currentEntitlement;
}

export function isEntitled(state: EntitlementState = currentEntitlement): boolean {
  return ['trial', 'active', 'grace'].includes(state.status);
}
