import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { getFavourites } from 'favourites';
import { HolidaysStoreBaseType } from './with-holidays-store-base';

export function withHolidaysStoreComputed() {
  return signalStoreFeature(
    type<HolidaysStoreBaseType>(),
    withComputed((state) => ({
      holidays: () => {
        const { query, type } = state.filter();
        return state
          .entities()
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
