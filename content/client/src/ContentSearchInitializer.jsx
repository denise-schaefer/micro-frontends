import React from 'react';
import { registerSearchProvider, removeSearchProvider } from 'search-api';
import { executeContentCount, executeContentSearch } from './search';
import ContentSearchTab from './ContentSearchTab';
import ContentSearchResult from './ContentSearchResult';
import { I18nextProvider } from 'react-i18next';

export const SEARCH_PROVIDER_ID = 'content';
const ORDER = 2;

export const initialize = () => {
  registerSearchProvider({
    ID: SEARCH_PROVIDER_ID,
    order: ORDER,
    execute_search: queryData => executeContentSearch(queryData),
    execute_count: queryData => executeContentCount(queryData),
    // eslint-disable-next-line no-unused-vars
    getNavComponent: (queryData, data, fetchData) => <div style={{ width: '13.75em' }} />,
    getTabComponent: data => (
      <I18nextProvider i18n={global.i18next}>
        <ContentSearchTab data={data} />
      </I18nextProvider>
    ),
    getResultComponent: (queryData, data, fetchData) => (
      <I18nextProvider i18n={global.i18next}>
        <ContentSearchResult queryData={queryData} data={data} fetchData={fetchData} />
      </I18nextProvider>
    ),
  });
};

// as soon we have health checks, we can remove search provider in case of errors
// search provider will disappear in search tabs
export const shutdown = () => {
  removeSearchProvider(SEARCH_PROVIDER_ID);
};
