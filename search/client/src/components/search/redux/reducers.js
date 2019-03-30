import { createStructuredSelector } from 'reselect';
import { getSearchProviders } from 'search-api';

import {
	UPDATE_SEARCH_DATA,
	UPDATE_COUNT_DATA,
	SEARCH_ERROR,
	SEARCH_COUNT_ERROR,
	SET_LOADING_STATE,
	UPDATE_SUGGESTIONS,
	SET_DISPLAY_SUGGESTIONS,
	SET_ACTIVE_SEARCH_PROVIDER,
	RESET_SEARCH_STATE
} from './actions';
import isEmpty from '../../../util/isEmpty';

export const reducerNameSearch = 'search/search';

const hasNoValidResult = current => {
	if (isEmpty(current.data)) {
		return true;
	}

	return !current.data.count || current.data.count === 0;
};

// export only for testing
export const getValidActiveProvider = (current, searchProviders, searchState) => {
	const isCurrentProviderActive = current && current.activeProvider.ID === current.ID;

	if (isCurrentProviderActive && hasNoValidResult(current)) {
		const newSearchProviders = searchProviders.filter(provider => provider.ID !== current.ID);
		const newActive = { ...newSearchProviders[0] };
		const newActiveData = searchState[newActive.ID];

		if (!isEmpty(newSearchProviders)) {
			return getValidActiveProvider(
				{
					ID: newActive.ID,
					data: newActiveData,
					activeProvider: newActive
				},
				newSearchProviders,
				searchState
			);
		}
		// if there is no provider with any search results,
		// we return null and show search suggestions
		return null;
	}
	return current ? current.activeProvider : null;
};

const updateSearchData = (action, state) => {
	const { ID, activeSearchProvider, queryData, data } = action;

	const newSearchState = {
		...state.searchState
	};

	newSearchState[ID] = data;

	const newQueryState = {
		...state.queryState
	};

	newQueryState[ID] = {
		...queryData,
		searchType: ID.toLowerCase()
	};

	const newErrorState = {
		...state.errorState
	};

	newErrorState[ID] = { error: false, message: '' };

	return {
		...state,
		activeSearchProvider: getValidActiveProvider(
			{ ID, data, activeProvider: { ...activeSearchProvider } },
			getSearchProviders(),
			newSearchState
		),
		searchState: newSearchState,
		errorState: newErrorState,
		queryState: newQueryState
	};
};

const updateSuggestions = (action, state) => {
	const { ID, data } = action;

	const newSearchState = {
		...state.searchState
	};

	newSearchState[ID] = data;

	return {
		...state,
		activeSearchProvider: null,
		searchState: newSearchState
	};
};

const updateCountData = (action, state) => {
	const { ID, data } = action;

	const newSearchState = {
		...state.searchState
	};

	newSearchState[ID] = {
		...state.searchState[ID],
		count: data.count
	};

	const newErrorState = {
		...state.errorState
	};

	newErrorState[ID] = { error: false, message: '' };

	return {
		...state,
		searchState: newSearchState,
		errorState: newErrorState
	};
};

const searchError = (action, state) => {
	const { ID, activeSearchProvider } = action;

	const newSearchState = {
		...state.searchState
	};

	newSearchState[ID] = {};

	const newErrorState = {
		...state.errorState
	};

	newErrorState[ID] = { error: true, message: action.message };

	return {
		...state,
		activeSearchProvider: getValidActiveProvider(
			{ ID, data: {}, activeProvider: { ...activeSearchProvider } },
			getSearchProviders(),
			newSearchState
		),
		searchState: newSearchState,
		errorState: newErrorState,
		loadingState: false
	};
};

const searchCountError = (action, state) => {
	const { ID } = action;

	const newSearchState = {
		...state.searchState
	};

	newSearchState[ID] = {};

	const newErrorState = {
		...state.errorState
	};

	newErrorState[ID] = { error: true, message: action.message };

	return {
		...state,
		searchState: newSearchState,
		errorState: newErrorState
	};
};

const initialState = {
	searchState: {},
	errorState: {},
	queryState: {},
	activeSearchProvider: {},
	loadingState: false,
	displaySuggestions: false
};

const search = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_SEARCH_DATA:
			return updateSearchData(action, state);

		case UPDATE_COUNT_DATA:
			return updateCountData(action, state);

		case UPDATE_SUGGESTIONS:
			return updateSuggestions(action, state);

		case SEARCH_ERROR:
			return searchError(action, state);

		case SEARCH_COUNT_ERROR:
			return searchCountError(action, state);

		case SET_LOADING_STATE:
			return {
				...state,
				loadingState: action.isLoading
			};

		case SET_DISPLAY_SUGGESTIONS:
			return {
				...state,
				displaySuggestions: action.displaySuggestions
			};

		case SET_ACTIVE_SEARCH_PROVIDER:
			return {
				...state,
				activeSearchProvider: action.activeSearchProvider
			};

		case RESET_SEARCH_STATE:
			return initialState;

		default:
			return state;
	}
};

const selectSearchState = state => state[reducerNameSearch] && state[reducerNameSearch].searchState;
const selectErrorState = state => state[reducerNameSearch] && state[reducerNameSearch].errorState;
const selectQueryState = state => state[reducerNameSearch] && state[reducerNameSearch].queryState;
const selectLoadingState = state =>
	state[reducerNameSearch] && state[reducerNameSearch].loadingState;
const selectDisplaySuggestions = state =>
	state[reducerNameSearch] && state[reducerNameSearch].displaySuggestions;
const selectActiveSearchProvider = state =>
	state[reducerNameSearch] && state[reducerNameSearch].activeSearchProvider;

export const structuredSelector = createStructuredSelector({
	searchState: selectSearchState,
	errorState: selectErrorState,
	queryState: selectQueryState,
	loadingState: selectLoadingState,
	displaySuggestions: selectDisplaySuggestions,
	activeSearchProvider: selectActiveSearchProvider
});

global.reducerRegistry.register(reducerNameSearch, search);

export default search;
