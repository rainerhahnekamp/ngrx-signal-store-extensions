import { SignalStoreFeature, EmptyFeatureResult } from '@ngrx/signals';

export type SignalStoreFeatureType<
  Feature extends (
    ...params: never[]
  ) => SignalStoreFeature<EmptyFeatureResult, EmptyFeatureResult>,
> = Feature extends (
  ...params: never[]
) => SignalStoreFeature<EmptyFeatureResult, infer Output>
  ? Output
  : never;
