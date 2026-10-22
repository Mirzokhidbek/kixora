/**
 * Loyalty rules shown in the UI. Points are awarded by the server (src/libs/orderRules.ts):
 * 1 point per $10 of a delivered order.
 */
export const POINTS_PER_DOLLARS = 10;

export const pointsForTotal = (total: number) => Math.round(total / POINTS_PER_DOLLARS);

export const TIERS = [
  { name: "Member", min: 0 },
  { name: "Silver", min: 100 },
  { name: "Gold", min: 500 },
  { name: "Elite", min: 1500 },
] as const;

/** Current tier and how many points are missing for the next one */
export function tierFor(points: number) {
  const index = TIERS.reduce((found, tier, i) => (points >= tier.min ? i : found), 0);
  const next = TIERS[index + 1];
  return { name: TIERS[index].name, next: next ? { name: next.name, pointsNeeded: next.min - points } : null };
}
