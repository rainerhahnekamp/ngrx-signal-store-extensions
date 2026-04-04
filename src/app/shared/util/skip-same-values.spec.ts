import { describe, expect, it } from 'vitest';
import { skipSameValues } from './skip-same-values';
import { getState, patchState, signalState, watchState } from '@ngrx/signals';

const createUser = () => ({
  name: {
    firstname: 'John',
    lastname: 'Doe',
  },
  address: {
    street: 'Main Street',
    city: 'Dower',
  },
});

type User = ReturnType<typeof createUser>;

describe('skipSameValues', () => {
  it('should return empty object if values are the same', () => {
    const user = createUser();

    const getChangeValues = skipSameValues<User>({
      name: { firstname: 'John', lastname: 'Doe' },
    });
    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({});
  });

  it('should return whole object if values are the same', () => {
    const user = createUser();

    const getChangeValues = skipSameValues<User>({
      name: { firstname: 'Johannes', lastname: 'Doe' },
    });
    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({
      name: { firstname: 'Johannes', lastname: 'Doe' },
    });
  });

  it('should return only changed part of within nested object', () => {
    const user = createUser();
    const getChangeValues = skipSameValues<User>({
      name: {
        firstname: 'John',
        lastname: 'Doe',
      },
      address: {
        street: 'Second Street',
        city: 'Dower',
      },
    });

    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({
      address: { street: 'Second Street', city: 'Dower' },
    });
  });

  it('should only accept partial on the first level', () => {
    skipSameValues<User>({
      // @ts-expect-error - lastname is required
      name: {
        firstname: 'John',
      },
    });
  });

  it('should also work on third level change', () => {
    const user = {
      ...createUser(),
      family: {
        father: {
          firstname: 'John',
          lastname: 'Doe',
        },
        mother: {
          firstname: 'Jane',
          lastname: 'Doe',
        },
      },
    };

    const getChangeValues = skipSameValues<typeof user>({
      family: {
        father: {
          firstname: 'John',
          lastname: 'Doe',
        },
        mother: {
          firstname: 'Jane',
          lastname: 'Smith', // Maiden Name
        },
      },
    });

    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({
      family: {
        father: { firstname: 'John', lastname: 'Doe' },
        mother: { firstname: 'Jane', lastname: 'Smith' },
      },
    });
  });

  it('should also work with arrays', () => {
    const user = { ...createUser(), friends: ['John', 'Jane'] };

    const getChangeValues = skipSameValues<typeof user>({
      name: {
        firstname: 'John',
        lastname: 'Doe',
      },
      friends: ['Jane', 'John'],
    });

    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({ friends: ['Jane', 'John'] });
  });

  it('should match different types array and object', () => {
    const user = {
      ...createUser(),
      friends: ['John', 'Jane'] as string[] | { name: string }[],
    };

    const getChangeValues = skipSameValues<typeof user>({
      friends: [{ name: 'Jane' }, { name: 'John' }],
    });

    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({
      friends: [{ name: 'Jane' }, { name: 'John' }],
    });
  });

  it('should match different types primitive and object', () => {
    const user = { ...createUser(), birthday: '1990-01-01' as string | Date };

    const getChangeValues = skipSameValues<typeof user>({
      birthday: new Date('1990-01-01'),
    });

    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({ birthday: new Date('1990-01-01') });
  });

  it('should also work for optional properties', () => {
    const user: {
      name: { firstname: string; lastname: string; age?: number };
    } = {
      name: { firstname: 'John', lastname: 'Doe', age: 30 },
    };

    const getChangeValues = skipSameValues<typeof user>({
      name: {
        firstname: 'Johannes',
        lastname: 'Doe',
      },
    });

    const changedValue = getChangeValues(user);

    expect(changedValue).toStrictEqual({
      name: { firstname: 'Johannes', lastname: 'Doe' },
    });
  });

  it('should also support updater function as parameter', () => {
    const user = createUser();
    const getChangeValues = skipSameValues<User>(({ name }) => ({
      name: { ...name },
    }));
    const changedValue = getChangeValues(user);
    expect(changedValue).toStrictEqual({});
  });

  describe('coverage tests', () => {
    it('treats null and object as different', () => {
      type Row = { meta: { x: number } | null };
      const state: Row = { meta: null };
      const patch = skipSameValues<Row>({ meta: { x: 1 } })(state);
      expect(patch).toStrictEqual({ meta: { x: 1 } });
    });

    it('treats array and plain object as different', () => {
      type Row = { items: string[] | Record<string, string> };
      const state: Row = { items: {} };
      const patch = skipSameValues<Row>({ items: ['a'] })(state);
      expect(patch).toStrictEqual({ items: ['a'] });
    });

    it('treats unequal primitives as different', () => {
      type Row = { n: number };
      const patch = skipSameValues<Row>({ n: 2 })({ n: 1 });
      expect(patch).toStrictEqual({ n: 2 });
    });
  });

  describe('integration tests', () => {
    it('infers state from patchState ', () => {
      const user = signalState(createUser());

      // @ts-expect-error - middleName does not exist
      patchState(
        user,
        skipSameValues({
          name: { firstname: 'John', middleName: 'J.G.', lastname: 'Doe' },
        }),
      );
    });

    it('does not change state if values are the same ', () => {
      const userState = signalState(createUser());
      const originalName = userState.name();

      patchState(userState, { name: { firstname: 'John', lastname: 'Doe' } });
      expect(userState.name()).not.toBe(originalName);

      const changedName = userState.name();
      patchState(
        userState,
        skipSameValues({ name: { firstname: 'John', lastname: 'Doe' } }),
      );
      expect(userState.name()).toBe(changedName);
    });
  });
});
