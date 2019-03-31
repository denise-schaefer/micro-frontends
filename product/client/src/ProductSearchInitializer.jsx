import React from 'react';
import { registerSearchProvider, removeSearchProvider } from 'search-api';
import { executeProductCount, executeProductSearch } from './search';
import ProductSearchTab from './ProductSearchTab';
import ProductSearchNav from './ProductSearchNav';
import ProductSearchResult from './ProductSearchResult';
import { I18nextProvider } from 'react-i18next';

export const SEARCH_PROVIDER_ID = 'PRODUCT';
const ORDER = 1;

export const initialize = () => {
  registerSearchProvider({
    ID: SEARCH_PROVIDER_ID,
    order: ORDER,
    execute_search: queryData => executeProductSearch(queryData),
    execute_count: queryData => executeProductCount(queryData),
    // eslint-disable-next-line no-unused-vars
    handlePushHistory: queryData => {},
    getNavComponent: (queryData, data, fetchData) => (
      <I18nextProvider i18n={global.i18next}>
        <ProductSearchNav queryData={queryData} data={data} fetchData={fetchData} />
      </I18nextProvider>
    ),
    getTabComponent: data => (
      <I18nextProvider i18n={global.i18next}>
        <ProductSearchTab data={data} />
      </I18nextProvider>
    ),
    getResultComponent: (queryData, data, fetchData) => (
      <I18nextProvider i18n={global.i18next}>
        <ProductSearchResult queryData={queryData} data={data} fetchData={fetchData} />
      </I18nextProvider>
    ),
  });
};

// as soon we have health checks, we can remove search provider in case of errors
// search provider will disappear in search tabs
export const shutdown = () => {
  removeSearchProvider(SEARCH_PROVIDER_ID);
};
