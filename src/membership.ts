import { getSetting, setSetting } from './storage';

/**
 * The local plan model. Paid without expiresAt = the lifetime StoreKit unlock
 * (iap.ts); paid with expiresAt = a 30-day gift-code plan (giftcodes.ts).
 */
export type PlanTier = 'free' | 'paid';

export interface Plan {
  tier: PlanTier;
  /** Epoch ms when the paid membership expires. Absent on free. */
  expiresAt?: number;
}

export function loadPlan(): Plan {
  try {
    const raw = getSetting('plan');
    if (!raw) return { tier: 'free' };
    const parsed = JSON.parse(raw) as Plan;
    // No expiresAt on a paid plan means a lifetime (one-time) unlock.
    if (parsed.tier === 'paid' && (parsed.expiresAt === undefined || parsed.expiresAt > Date.now())) {
      return parsed;
    }
    return { tier: 'free' };
  } catch {
    return { tier: 'free' };
  }
}

export function savePlan(plan: Plan): void {
  setSetting('plan', plan.tier === 'free' ? '' : JSON.stringify(plan));
}

/** Whole days of paid membership left to give away. */
export function remainingDays(plan: Plan): number {
  if (plan.tier !== 'paid' || !plan.expiresAt) return 0;
  return Math.max(0, Math.floor((plan.expiresAt - Date.now()) / 86400000));
}

// The old "split your remaining membership" gift scaffold lived here; it was
// superseded by the signed gift-code program in giftcodes.ts (docs/gift-codes.md).
