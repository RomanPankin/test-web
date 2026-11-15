import { useSyncExternalStore } from "react";

/**
 * Which product fills each place of a bundle, as the picker (`BundleBuilder`) has it - shared with
 * the bundle's details (`BundleDetails`), a separate island lower on the page, so the details
 * describe the console picked rather than every console on offer. Slot id → product id; a slot
 * not picked yet is absent. Per bundle, in this tab only.
 */
type Picks = Record<string, string>;

const EMPTY: Picks = {};
const picks = new Map<string, Picks>();
const listeners = new Set<() => void>();

export function setBundlePicks(comboId: string, next: Picks): void {
  const current = picks.get(comboId) ?? EMPTY;
  const same =
    Object.keys(next).length === Object.keys(current).length &&
    Object.entries(next).every(([slot, product]) => current[slot] === product);

  if (same) return;
  picks.set(comboId, next);
  for (const listener of listeners) listener();
}

export function useBundlePicks(comboId: string): Picks {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
    () => picks.get(comboId) ?? EMPTY,
    () => EMPTY,
  );
}
