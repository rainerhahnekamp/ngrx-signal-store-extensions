import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStoreFeature, withFeature, withState } from '@ngrx/signals';
import { withFavourites } from '../../../../shared/signal-store-features/with-favourites';
import { withLocalStorageSync } from '../../../../shared/signal-store-features/with-local-storage-sync';
import { withLastUpdated } from '../../../../shared/signal-store-features/with-last-updated';
import { HolidaysOwnState } from './types';
import { SignalStoreFeatureType } from '../../../../shared/signal-store-features/signal-store-feature-type';

export type HolidaysStoreBaseType = SignalStoreFeatureType<
  typeof withHolidaysStoreBase
>;

export function withHolidaysStoreBase() {
  return signalStoreFeature(
    withDevtools('holidays'),
    withState<HolidaysOwnState>({
      _holidays: [],
      isLoaded: false,
      filter: { query: '', type: 0 },
    }),
    withFavourites(),
    withLocalStorageSync('holidays', false),
    withFeature((store) =>
      withLastUpdated(1000, () => ({
        holidays: store._holidays(),
        favouriteIds: store._favouriteIds(),
      })),
    ),
  );
}
