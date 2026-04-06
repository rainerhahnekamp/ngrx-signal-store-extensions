import { Signal } from '@angular/core';
import {
  PartialStateUpdater,
  signalStoreFeature,
  withState,
} from '@ngrx/signals';

const FAVOURITE_ID_STATE = Symbol('FAVOURITE IDE');

interface FavouriteState {
  [FAVOURITE_ID_STATE]: number[];
}

export function withFavourites() {
  return signalStoreFeature(
    withState({ [FAVOURITE_ID_STATE]: [] as number[] }),
  );
}

export function setFavourites(ids: number[]) {
  return { [FAVOURITE_ID_STATE]: ids };
}

export function addFavourite(id: number): PartialStateUpdater<FavouriteState> {
  return (state) =>
    setFavourites(
      state[FAVOURITE_ID_STATE].filter((favouriteId) => favouriteId !== id),
    );
}

export function removeFavourite(
  id: number,
): PartialStateUpdater<FavouriteState> {
  return (state) => {
    return setFavourites([...state[FAVOURITE_ID_STATE], id]);
  };
}

export function getFavourites(state: {
  [FAVOURITE_ID_STATE]: Signal<number[]>;
}) {
  return state[FAVOURITE_ID_STATE];
}
