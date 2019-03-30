import { createI18next } from '@dm/i18n';
import { ReducerRegistry, createStoreWithReducerRegistry, combine } from '@dm/redux-store-provider';

global.i18next = global.i18next || createI18next();

global.reducerRegistry = global.reducerRegistry || new ReducerRegistry();

const getStore = createStoreWithReducerRegistry(global.reducerRegistry);
global.store = global.store || getStore();

// Replace the store's reducer whenever a new reducer is registered.
global.reducerRegistry.setChangeListener(reducers => {
  global.store.replaceReducer(combine(reducers, {}));
});
