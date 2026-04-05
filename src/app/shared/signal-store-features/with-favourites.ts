import {
  PartialStateUpdater,
  signalStoreFeature,
  withState,
} from '@ngrx/signals';

interface FavouriteState {
  _favouriteIds: number[];
}

export function withFavourites() {
  return signalStoreFeature(withState({ _favouriteIds: [] as number[] }));
}

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
