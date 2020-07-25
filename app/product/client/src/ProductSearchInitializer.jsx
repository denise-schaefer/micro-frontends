import React from 'react';
import { registerSearchProvider, removeSearchProvider } from 'search-api';
import { executeProductCount, executeProductSearch } from './search';
import ProductSearchTab from './ProductSearchTab';
import ProductSearchResult from './ProductSearchResult';

export const SEARCH_PROVIDER_ID = 'product';
const ORDER = 1;

export const initialize = () => {
  registerSearchProvider({
    ID: SEARCH_PROVIDER_ID,
    order: ORDER,
    execute_search: (queryData) => executeProductSearch(queryData),
    execute_count: (queryData) => executeProductCount(queryData),
    getTabComponent: (data) => <ProductSearchTab data={data} />,
    getResultComponent: (queryData, data, fetchData) => (
      <ProductSearchResult queryData={queryData} data={data} fetchData={fetchData} />
    ),
  });
};

// as soon we have health checks, we can remove search provider in case of errors
// search provider will disappear in search tabs
export const shutdown = () => {
  removeSearchProvider(SEARCH_PROVIDER_ID);
};
