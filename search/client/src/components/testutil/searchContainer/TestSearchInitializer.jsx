import React from 'react';
import { registerSearchProvider, removeSearchProvider } from 'search-api';
import { executeProductCount, executeProductSearch } from './actions';

export const testProvider = (SEARCH_PROVIDER_ID, ORDER) => ({
	ID: SEARCH_PROVIDER_ID,
	order: ORDER,
	execute_search: queryData => executeProductSearch(queryData),
	execute_count: queryData => executeProductCount(queryData),
	// eslint-disable-next-line no-unused-vars
	handlePushHistory: queryData => {},
	// eslint-disable-next-line no-unused-vars
	getNavComponent: (queryData, data, fetchData) => <div>Filter-Nav</div>,
	getTabComponent: data => (
		<div>
			{SEARCH_PROVIDER_ID} Search Tab {data && data.results && data.results.count}
		</div>
	),
	getResultComponent: (querydata, data) => (
		<div>
			<h1>{`Suche nach ${querydata.query}`}</h1>
			<div>
				{/* eslint-disable-next-line react/no-array-index-key */}
				{data.results.results.map((result, index) => <span key={`_${index}`}>{result}</span>)}
			</div>
		</div>
	)
});

export const initialize = provider => {
	registerSearchProvider(provider);
};

export const shutdown = id => {
	removeSearchProvider(id);
};
