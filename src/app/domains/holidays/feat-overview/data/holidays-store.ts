import { signalStore, withHooks } from '@ngrx/signals';
import { withMethodsProfiler } from '../../../../shared/signal-store-features/with-methods-profiler';
import { withHolidaysStoreBase } from './with-holidays-store-base';
import { withHolidaysStoreComputed } from './with-holidays-store-computed';
import { withHolidaysStoreMethods } from './with-holidays-store-methods';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withHolidaysStoreBase(),
  withHolidaysStoreMethods(),
  withHolidaysStoreComputed(),
  withMethodsProfiler(),
  withHooks((store) => ({
    onInit() {
      if (!store.isLoaded()) {
        store._load();
      }
    },
  })),
);
