import { linkedSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  patchState,
  signalStoreFeature,
  withHooks,
  withLinkedState,
  withState,
} from '@ngrx/signals';
import { timer } from 'rxjs';
import { SignalStoreFeatureType } from './signal-store-feature-type';

export const TRACKING_SIGNAL = Symbol('TRACKING_SIGNAL');

export type LastUpdatedFeature = SignalStoreFeatureType<typeof withLastUpdated>;

export function withLastUpdated(
  updateInterval = 1000,
  trackingSignal: () => unknown,
) {
  return signalStoreFeature(
    withState({
      lastUpdatedName: '',
    }),
    withLinkedState(() => ({
      [TRACKING_SIGNAL]: linkedSignal(() => {
        trackingSignal();
        return Date.now();
      }),
    })),
    withHooks((store) => ({
      onInit() {
        timer(0, updateInterval)
          .pipe(takeUntilDestroyed())
          .subscribe(() =>
            patchState(store, (state) => ({
              lastUpdatedName: calcTimeName(state[TRACKING_SIGNAL]),
            })),
          );
      },
    })),
  );
}

function calcTimeName(lastUpdated: number) {
  const now = Date.now();
  const seconds = Math.floor((now - lastUpdated) / 1000);

  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);

  return `${days} day${days > 1 ? 's' : ''} ago`;
}
