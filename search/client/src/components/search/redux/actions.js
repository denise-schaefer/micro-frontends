const createActionName = name => `search/search/${name}`;
export const UPDATE_SEARCH_DATA = createActionName('UPDATE_SEARCH_DATA');
export const UPDATE_COUNT_DATA = createActionName('UPDATE_COUNT_DATA');
export const UPDATE_SUGGESTIONS = createActionName('UPDATE_SUGGESTIONS');
export const SEARCH_ERROR = createActionName('SEARCH_ERROR');
export const SEARCH_COUNT_ERROR = createActionName('SEARCH_COUNT_ERROR');
export const SET_LOADING_STATE = createActionName('SET_LOADING_STATE');
export const SET_DISPLAY_SUGGESTIONS = createActionName('SET_DISPLAY_SUGGESTIONS');
export const SET_ACTIVE_SEARCH_PROVIDER = createActionName('SET_ACTIVE_SEARCH_PROVIDER');
export const RESET_SEARCH_STATE = createActionName('RESET_SEARCH_STATE');

const updateSearchData = (ID, activeSearchProvider, queryData, data) => ({
	type: UPDATE_SEARCH_DATA,
	ID,
	activeSearchProvider,
	queryData,
	data
});

const updateCountData = (ID, data) => ({
	type: UPDATE_COUNT_DATA,
	ID,
	data
});

const updateSuggestions = (ID, data) => ({
	type: UPDATE_SUGGESTIONS,
	ID,
	data
});

const searchError = (ID, activeSearchProvider, message) => ({
	type: SEARCH_ERROR,
	ID,
	activeSearchProvider,
	message
});

const searchCountError = (ID, message) => ({
	type: SEARCH_COUNT_ERROR,
	ID,
	message
});

const setLoadingState = isLoading => ({
	type: SET_LOADING_STATE,
	isLoading
});

const setDisplaySuggestions = displaySuggestions => ({
	type: SET_DISPLAY_SUGGESTIONS,
	displaySuggestions
});

const setActiveSearchProvider = activeSearchProvider => ({
	type: SET_ACTIVE_SEARCH_PROVIDER,
	activeSearchProvider
});

const resetSearchState = () => ({
	type: RESET_SEARCH_STATE
});

export {
	updateSearchData,
	updateCountData,
	updateSuggestions,
	searchError,
	searchCountError,
	setLoadingState,
	setDisplaySuggestions,
	setActiveSearchProvider,
	resetSearchState
};
