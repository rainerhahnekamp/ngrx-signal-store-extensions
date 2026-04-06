import { signalStoreFeature, withComputed } from '@ngrx/signals';
import { getFavourites } from 'favourites';
import { withHolidaysStoreMethods } from './2-holidays-store-methods';

export function withHolidaysStoreComputed() {
  return signalStoreFeature(
    withHolidaysStoreMethods(),
    withComputed((state) => ({
      holidays: () => {
        const { query, type } = state.filter();
        return state
          ._holidays()
          .filter((holiday) => holiday.title.includes(query))
          .filter((holiday) => !type || holiday.typeId === type)
          .map((holiday) => ({
            ...holiday,
            isFavourite: getFavourites(state)().includes(holiday.id),
          }));
      },
    })),
  );
}
