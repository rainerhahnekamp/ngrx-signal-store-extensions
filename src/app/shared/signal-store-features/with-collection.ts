import { Signal } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';

type CollectionMethods<
  AddSetter extends boolean,
  Name extends string,
  Collection extends { id: number },
> = AddSetter extends true
  ? Record<`set${Capitalize<Name>}`, (collection: Collection[]) => void>
  : Record<string, never>;

export function withCollection<
  Collection extends { id: number },
  Name extends string,
  AddSetter extends boolean = true,
>(name: Name, _: Collection, addSetter = true as AddSetter) {
  return signalStoreFeature(
    withEntities<Collection>(),
    withMethods((store) => {
      if (!addSetter) {
        return {} as CollectionMethods<AddSetter, Name, Collection>;
      }
      return {
        ['set' + capitalize(name)]: (collection: Collection[]) => {
          patchState(store, setAllEntities(collection));
        },
      } as CollectionMethods<AddSetter, Name, Collection>;
    }),
    withComputed(
      (store) =>
        ({ [name]: store.entities as Signal<Collection[]> }) as Record<
          Name,
          Signal<Collection[]>
        >,
    ),
  );
}

function capitalize(name: string) {
  return name[0].toUpperCase() + name.slice(1);
}
