import { createStructuredSelector } from 'reselect';
import {
  DO_LOAD_COUNT_FAILED,
  DO_LOAD_COUNT_FINISHED,
  DO_LOAD_COUNT_STARTED,
  DO_LOAD_DATA_FAILED,
  DO_LOAD_DATA_FINISHED,
  DO_LOAD_DATA_STARTED,
  DO_LOAD_SUGGESTIONS_FAILED,
  DO_LOAD_SUGGESTIONS_FINISHED,
  DO_LOAD_SUGGESTIONS_STARTED,
  RESET_SEARCH_STATE,
  SET_ACTIVE_SEARCH_PROVIDER,
} from './actions';

const reducerNameSearch = 'search/search';

const updateSearchData = (action, state) => {
  const { ID, activeSearchProvider, queryData, data } = action;

  const newSearchState = {
    ...state.searchState,
    [ID]: data,
  };

  const newQueryState = {
    ...state.queryState,
    [ID]: {
      ...queryData,
      searchType: ID.toLowerCase(),
    },
  };

  const newErrorState = {
    ...state.errorState,
    [ID]: { error: false, message: '' },
  };

  return {
    ...state,
    activeSearchProvider,
    searchState: newSearchState,
    errorState: newErrorState,
    queryState: newQueryState,
  };
};

const updateCountData = (action, state) => {
  const shouldUpdateQueryState = () => {
    // eslint-disable-next-line prettier/prettier
    return action.queryData.query !== state.queryState[action.ID] || !state.queryState[action.ID];
  };

  const newQueryState = {
    ...state.queryState,
    [action.ID]: {
      ...action.queryData,
      searchType: action.ID.toLowerCase(),
    },
  };

  return {
    ...state,
    queryState: shouldUpdateQueryState() ? newQueryState : { ...state.queryState },
    countState: {
      ...state.countState,
      [action.ID]: {
        count: null,
        loadingState: 'loading',
      },
    },
  };
};

const updateSuggestions = (action, state) => {
  const { ID, data } = action;

  const newSearchState = {
    ...state.searchState,
  };

  newSearchState[ID] = data;

  return {
    ...state,
    activeSearchProvider: null,
    searchState: newSearchState,
  };
};

const searchError = (action, state) => {
  const { ID, activeSearchProvider } = action;

  const newSearchState = {
    ...state.searchState,
  };

  newSearchState[ID] = {};

  const newErrorState = {
    ...state.errorState,
  };

  newErrorState[ID] = { error: true, message: action.message };

  return {
    ...state,
    activeSearchProvider,
    searchState: newSearchState,
    errorState: newErrorState,
    loadingState: false,
  };
};

const searchCountError = (action, state) => {
  const { ID } = action;

  const newSearchState = {
    ...state.searchState,
  };

  newSearchState[ID] = {};

  const newErrorState = {
    ...state.errorState,
  };

  newErrorState[ID] = { error: true, message: action.message };

  return {
    ...state,
    searchState: newSearchState,
    errorState: newErrorState,
  };
};

const initialState = {
  searchState: {},
  countState: {},
  errorState: {},
  queryState: {},
  activeSearchProvider: {},
  loadingState: false,
  displaySuggestions: false,
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case DO_LOAD_DATA_STARTED:
      return {
        ...state,
        activeSearchProvider: action.activeSearchProvider,
        loadingState: true,
      };

    case DO_LOAD_DATA_FINISHED: {
      const newState = updateSearchData(action, state);
      return {
        ...newState,
        activeSearchProvider: action.activeSearchProvider,
        loadingState: false,
      };
    }

    case DO_LOAD_DATA_FAILED: {
      const newState = searchError(action, state);
      return {
        ...newState,
        activeSearchProvider: action.activeSearchProvider,
        loadingState: false,
      };
    }

    case DO_LOAD_COUNT_STARTED: {
      return updateCountData(action, state);
    }

    case DO_LOAD_COUNT_FINISHED: {
      return {
        ...state,
        countState: {
          ...state.countState,
          [action.ID]: {
            count: action.data.count,
            loadingState: 'finished',
          },
        },
      };
    }

    case DO_LOAD_COUNT_FAILED: {
      const nextState = searchCountError(action, state);
      return {
        ...nextState,
        countState: {
          ...nextState.countState,
          [action.ID]: {
            count: null,
            loadingState: 'failed',
          },
        },
      };
    }

    case DO_LOAD_SUGGESTIONS_STARTED:
      return {
        ...state,
        displaySuggestions: action.displaySuggestions,
      };

    case DO_LOAD_SUGGESTIONS_FINISHED: {
      return updateSuggestions(action, state);
    }

    case DO_LOAD_SUGGESTIONS_FAILED: {
      return searchError(action, state);
    }

    case SET_ACTIVE_SEARCH_PROVIDER:
      return {
        ...state,
        activeSearchProvider: action.activeSearchProvider,
      };

    case RESET_SEARCH_STATE:
      return initialState;

    default:
      return state;
  }
};

const selectSearchState = state => state[reducerNameSearch] && state[reducerNameSearch].searchState;
const selectCountState = state => state[reducerNameSearch] && state[reducerNameSearch].countState;
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
  countState: selectCountState,
  errorState: selectErrorState,
  queryState: selectQueryState,
  loadingState: selectLoadingState,
  displaySuggestions: selectDisplaySuggestions,
  activeSearchProvider: selectActiveSearchProvider,
});

global.reducerRegistry.register(reducerNameSearch, search);

export default search;
