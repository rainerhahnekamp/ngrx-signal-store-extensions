import {
  PartialStateUpdater,
  signalStoreFeature,
  withState,
} from '@ngrx/signals';
import { SignalStoreFeatureType } from './signal-store-feature-type';

export function withFavourites() {
  return signalStoreFeature(withState({ _favouriteIds: [] as number[] }));
}

export type FavouritesFeature = SignalStoreFeatureType<typeof withFavourites>;

type FavouriteState = FavouritesFeature['state'];

export function addFavourite(id: number): PartialStateUpdater<FavouriteState> {
  return ({ _favouriteIds }) => ({
    _favouriteIds: _favouriteIds.filter((favouriteId) => favouriteId !== id),
  });
}

export function removeFavourite(
  id: number,
): PartialStateUpdater<FavouriteState> {
  return ({ _favouriteIds }) => ({ _favouriteIds: [..._favouriteIds, id] });
}
