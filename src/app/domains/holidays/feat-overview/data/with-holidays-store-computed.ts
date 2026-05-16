import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { HolidaysStoreBaseType } from './with-holidays-store-base';

export function withHolidaysStoreComputed() {
  return signalStoreFeature(
    type<HolidaysStoreBaseType>(),
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
  );
}
