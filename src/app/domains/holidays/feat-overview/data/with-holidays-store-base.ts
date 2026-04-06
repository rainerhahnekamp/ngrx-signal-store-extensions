import { withDevtools } from '@angular-architects/ngrx-toolkit';
import {
  signalStoreFeature,
  type,
  withFeature,
  withState,
} from '@ngrx/signals';
import { SignalStoreFeatureType } from '../../../../shared/signal-store-features/signal-store-feature-type';
import { withCollection } from '../../../../shared/signal-store-features/with-collection';
import { withFavourites } from '../../../../shared/signal-store-features/with-favourites';
import { withLastUpdated } from '../../../../shared/signal-store-features/with-last-updated';
import { withLocalStorageSync } from '../../../../shared/signal-store-features/with-local-storage-sync';
import { Holiday } from '../../model/holiday';
import { HolidaysOwnState } from './types';

export type HolidaysStoreBaseType = SignalStoreFeatureType<
  typeof withHolidaysStoreBase
>;

export function withHolidaysStoreBase() {
  return signalStoreFeature(
    withDevtools('holidays'),
    withState<HolidaysOwnState>({
      isLoaded: false,
      filter: { query: '', type: 0 },
    }),
    withCollection('_holidays', type<Holiday>()),
    withFavourites(),
    withLocalStorageSync('holidays', false),
    withFeature((store) =>
      withLastUpdated(1000, () => ({
        holidays: store._holidays,
        favouriteIds: store._favouriteIds(),
      })),
    ),
  );
}
