import byOrder from './util/sort';
import isEmpty from './util/isEmpty';

global.search = global.search || {};
global.search.searchProviders = global.search.searchProviders || {};

const { searchProviders } = global.search;

export const getSearchProviders = () => {
  if (isEmpty(searchProviders)) {
    throw new Error('No SearchProvider registered!');
  }
  return Object.keys(searchProviders)
    .map(key => searchProviders[key])
    .sort(byOrder);
};

export const registerSearchProvider = provider => {
  searchProviders[provider.ID] = { ...provider };
};

export const removeSearchProvider = ID => {
  delete searchProviders[ID];
};
