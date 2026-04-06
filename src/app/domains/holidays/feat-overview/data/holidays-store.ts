import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { timer } from 'rxjs';
import { MessageService } from '../../../../shared/ui-messaging/message/message.service';
import { skipSameValues } from '../../../../shared/util/skip-same-values';
import { Holiday } from '../../model/holiday';
import { HolidayFilter } from '../model/model';
import { HolidayClient } from './holiday-client';

export const HolidaysStore = signalStore(
  { providedIn: 'root' },
  withDevtools('holidays'),
  withState({
    _holidays: new Array<Holiday>(),
    isLoaded: false,
    _favouriteIds: new Array<number>(),
    filter: { query: '', type: 0 } as HolidayFilter,
    _lastUpdated: Date.now(),
    lastUpdatedName: '',
  }),
  withProps(() => ({
    _storageKey: 'holidays',
  })),
  withMethods(
    (
      store,
      holidayClient = inject(HolidayClient),
      messageService = inject(MessageService),
    ) => ({
      async _load() {
        const _holidays = await holidayClient.getHolidays();

        patchState(store, { _holidays, isLoaded: true });
      },
      async addFavourite(id: number) {
        patchState(store, {
          _favouriteIds: [...store._favouriteIds(), id],
        });
      },
      async removeFavourite(id: number) {
        patchState(store, {
          _favouriteIds: store
            ._favouriteIds()
            .filter((favouriteId) => favouriteId !== id),
        });
      },
      search(query: string, type: number) {
        patchState(store, skipSameValues({ filter: { query, type } }));
      },
      syncToStorage() {
        const state = getState(store);
        localStorage.setItem(store._storageKey, JSON.stringify(state));
        messageService.info('Holidays saved for offline usage');
      },
      loadFromStorage() {
        const data = localStorage.getItem(store._storageKey);
        if (!data) {
          return;
        }

        const state = JSON.parse(data);
        patchState(store, state);
      },
    }),
  ),
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
  withHooks((store) => ({
    onInit() {
      store.loadFromStorage();

      if (!store.isLoaded()) {
        store._load();
      }

      effect(() => {
        store._favouriteIds();
        store._holidays();
        store.filter();

        patchState(store, { _lastUpdated: Date.now() });
      });

      timer(0, 1000)
        .pipe(takeUntilDestroyed())
        .subscribe(() =>
          patchState(store, ({ _lastUpdated }) => ({
            lastUpdatedName: calcTimeName(_lastUpdated),
          })),
        );
    },
  })),
);

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
