// @flow
import byOrder from './util/sort';
import isEmpty from './util/isEmpty';

type SearchProvider = {
  ID: string,
  order: number,
  execute_search: (queryData: Object) => Function, // should return a function returning a Promise,
  execute_count: (queryData: Object) => Function, // should return a function returning a Promise
  getNavComponent: (queryData: Object, data: Object, fetchData: Function) => Object,
  getTabComponent: (data: Object) => Object,
  getResultComponent: (queryData: Object, data: Object, fetchData: Function) => Object,
};

global.search = global.search || {};
global.search.searchProviders = global.search.searchProviders || {};

const { searchProviders } = global.search;

export const getSearchProviders = (): Array<SearchProvider> => {
  if (isEmpty(searchProviders)) {
    throw new Error('No SearchProvider registered!');
  }
  return Object.keys(searchProviders)
    .map(key => searchProviders[key])
    .sort(byOrder);
};

export const registerSearchProvider = (provider: SearchProvider) => {
  searchProviders[provider.ID] = { ...provider };
};

export const removeSearchProvider = (ID: string) => {
  delete searchProviders[ID];
};
