import { signalStore, withHooks } from '@ngrx/signals';
import { withHolidaysStoreComputed as withHolidaysStoreBody } from './3-holidays-store-computed';

export const HolidaysStoreWithBuilder = signalStore(
  {
    providedIn: 'root',
  },
  withHolidaysStoreBody(),
  withHooks((store) => ({
    onInit() {
      if (!store.isLoaded()) {
        store._load();
      }
    },
  })),
);
