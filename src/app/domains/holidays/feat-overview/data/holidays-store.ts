import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addFavourite,
  removeFavourite,
  withFavourites,
} from '../../../../shared/signal-store-features/with-favourites';
import { withLastUpdated } from '../../../../shared/signal-store-features/with-last-updated';
import { withLocalStorageSync } from '../../../../shared/signal-store-features/with-local-storage-sync';
import { skipSameValues } from '../../../../shared/util/skip-same-values';
import { Holiday } from '../../model/holiday';
import { HolidayFilter } from '../model/model';
import { HolidayClient } from './holiday-client';
import { withMethodsProfiler } from '../../../../shared/signal-store-features/with-methods-profiler';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withDevtools('holidays'),
  withState({
    _holidays: new Array<Holiday>(),
    isLoaded: false,
    filter: { query: '', type: 0 } as HolidayFilter,
  }),
  withFavourites(),
  withLocalStorageSync('holidays', false),
  withFeature((store) =>
    withLastUpdated(1000, () => ({
      holidays: store._holidays(),
      favouriteIds: store._favouriteIds(),
    })),
  ),
  withMethods((store, holidayClient = inject(HolidayClient)) => ({
    async _load() {
      const _holidays = await holidayClient.getHolidays();

      patchState(store, { _holidays, isLoaded: true });
    },
    search(query: string, type: number) {
      patchState(store, skipSameValues({ filter: { query, type } }));
    },

    addFavourite(id: number) {
      patchState(store, addFavourite(id));
      holidayClient.addFavourite(id);
    },

    removeFavourite(id: number) {
      patchState(store, removeFavourite(id));
      holidayClient.removeFavourite(id);
    },
  })),
  withComputed((state) => ({
    holidays: () => {
      const { query, type } = state.filter();
      return state
        ._holidays()
        .filter((holiday) => holiday.title.includes(query))
        .filter((holiday) => !type || holiday.typeId === type)
        .map((holiday) => ({
          ...holiday,
          isFavourite: state._favouriteIds().includes(holiday.id),
        }));
    },
  })),
  withMethodsProfiler(),
  withHooks((store) => ({
    onInit() {
      if (!store.isLoaded()) {
        store._load();
      }
    },
  })),
);
