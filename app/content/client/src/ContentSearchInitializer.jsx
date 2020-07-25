import React from 'react';
import { registerSearchProvider, removeSearchProvider } from 'search-api';
import { executeContentCount, executeContentSearch } from './search';
import ContentSearchTab from './ContentSearchTab';
import ContentSearchResult from './ContentSearchResult';

export const SEARCH_PROVIDER_ID = 'content';
const ORDER = 2;

export const initialize = () => {
  registerSearchProvider({
    ID: SEARCH_PROVIDER_ID,
    order: ORDER,
    execute_search: (queryData) => executeContentSearch(queryData),
    execute_count: (queryData) => executeContentCount(queryData),
    getTabComponent: (data) => <ContentSearchTab data={data} />,
    getResultComponent: (queryData, data, fetchData) => (
      <ContentSearchResult queryData={queryData} data={data} fetchData={fetchData} />
    ),
  });
};

// as soon we have health checks, we can remove search provider in case of errors
// search provider will disappear in search tabs
export const shutdown = () => {
  removeSearchProvider(SEARCH_PROVIDER_ID);
};
