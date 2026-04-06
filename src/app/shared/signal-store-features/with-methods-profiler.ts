import {
  EmptyFeatureResult,
  signalStoreFeature,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  withProps,
} from '@ngrx/signals';
import { SignalStoreFeatureType } from './signal-store-feature-type';

const hiddenProperty = Symbol('hidden');

export function withHidden<
  Input extends SignalStoreFeatureResult,
>(): SignalStoreFeature<Input, EmptyFeatureResult> {
  return (store) => ({ ...store, props: { [hiddenProperty]: true } });
}

export function withBetterHidden() {
  return signalStoreFeature(
    withProps(() => ({ [hiddenProperty]: true }) as Record<string, never>),
  );
}

export type MethodsProfileFeature = SignalStoreFeatureType<
  typeof withMethodsProfiler
>;

export function withMethodsProfiler<
  Input extends SignalStoreFeatureResult,
>(): SignalStoreFeature<Input, EmptyFeatureResult> {
  return (store) => {
    if (typeof ngDevMode !== 'undefined' && !ngDevMode) {
      return { ...store, methods: store.methods as Input['methods'] };
    }

    const proxiedMethods = {} as Input['methods'];
    for (const methodName of Reflect.ownKeys(
      store.methods,
    ) as (keyof Input['methods'])[]) {
      console.debug(`profiling ${String(methodName)}`);
      proxiedMethods[methodName] = new Proxy(store.methods[methodName], {
        apply(target, thisArg, argArray: unknown[]) {
          const startedAt = performance.now();

          const result = Reflect.apply(target, thisArg, argArray);
          const end = performance.now();
          const duration = end - startedAt;

          console.group('profiler', String(methodName));
          console.info(
            `Start: ${new Date(performance.timeOrigin + startedAt).toLocaleTimeString()}`,
          );
          console.info(
            `End: ${new Date(performance.timeOrigin + end).toLocaleTimeString()}`,
          );
          console.info(`Duration: ${duration}ms`);
          console.log('Parameters: %o', argArray);
          console.info('Returned: %o', result);
          console.groupEnd();

          return result;
        },
      });
    }

    return { ...store, methods: proxiedMethods as Input['methods'] };
  };
}
