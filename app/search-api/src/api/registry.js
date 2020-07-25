import byOrder from './util/sort';
import isEmpty from './util/isEmpty';

const searchProviders = {};

export const registerSearchProvider = (provider) => {
  searchProviders[provider.ID] = { ...provider };
};

export const getSearchProviders = () => {
  if (isEmpty(searchProviders)) {
    throw new Error('No SearchProvider registered!');
  }
  return Object.keys(searchProviders)
    .map((key) => searchProviders[key])
    .sort(byOrder);
};

export const removeSearchProvider = (ID) => {
  delete searchProviders[ID];
};
