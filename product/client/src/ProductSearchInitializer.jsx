import React from 'react';
import { registerSearchProvider, removeSearchProvider } from 'search-api';
import {
	executeMockProductCountZeroCounts,
	executeMockProductSearchZeroCounts,
	executeProductCount,
	executeProductSearch
} from './search';
import ProductSearchTab from './ProductSearchTab';
import ProductSearchNav from './ProductSearchNav';
import ProductSearchResult from './ProductSearchResult';

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
			<ProductSearchNav queryData={queryData} data={data} fetchData={fetchData} />
		),
		getTabComponent: data => <ProductSearchTab data={data} />,
		getResultComponent: (queryData, data, fetchData) => (
			<ProductSearchResult queryData={queryData} data={data} fetchData={fetchData} />
		)
	});
};

export const initializeMockProductSearchWithZeroCounts = () => {
	registerSearchProvider({
		ID: SEARCH_PROVIDER_ID,
		order: ORDER,
		execute_search: queryData => executeMockProductSearchZeroCounts(queryData),
		execute_count: queryData => executeMockProductCountZeroCounts(queryData),
		// eslint-disable-next-line no-unused-vars
		handlePushHistory: queryData => {},
		getNavComponent: (queryData, data, fetchData) => (
			<ProductSearchNav queryData={queryData} data={data} fetchData={fetchData} />
		),
		getTabComponent: data => <ProductSearchTab data={data} />,
		getResultComponent: (queryData, data, fetchData) => (
			<ProductSearchResult queryData={queryData} data={data} fetchData={fetchData} />
		)
	});
};

// as soon we have health checks, we can remove search provider in case of errors
// search provider will disappear in search tabs
export const shutdown = () => {
	removeSearchProvider(SEARCH_PROVIDER_ID);
};