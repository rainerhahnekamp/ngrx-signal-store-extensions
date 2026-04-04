export function skipSameValues<State extends object>(
  partial: Partial<State>,
): (state: State) => Partial<State>;

export function skipSameValues<State extends object>(
  updater: (state: State) => Partial<State>,
): (state: State) => Partial<State>;

export function skipSameValues<State extends object>(
  partialOrUpdater: Partial<State> | ((state: State) => Partial<State>),
): (state: State) => Partial<State> {
  return (state) => {
    const partial =
      typeof partialOrUpdater === 'function'
        ? partialOrUpdater(state)
        : partialOrUpdater;
    const keys = Reflect.ownKeys(partial) as (keyof State)[];

    return keys.reduce((changes, key) => {
      const patchedValue = partial[key];
      const existingValue = state[key];
      if (!hasSameValue(existingValue, patchedValue)) {
        changes[key] = patchedValue;
      }
      return changes;
    }, {} as Partial<State>);
  };
}

function hasSameValue<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  // if one is primitive, we took already care of it
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // same as above but for null
  if (a === null || b === null) {
    return false;
  }

  // both arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((value, index) => hasSameValue(value, b[index]))
    );
  }

  // prevents {} === [] for type T[] | Record<string, unknown>
  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  const keysA = Object.keys(a) as (keyof T)[];
  const keysB = Object.keys(b) as (keyof T)[];

  // shortcut
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every((key) => hasSameValue(a[key], b[key]));
}
