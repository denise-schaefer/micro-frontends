import isEmpty from '../../util/isEmpty';
import { getSearchProviders } from 'search-api';

const createActionName = (name) => `search/search/${name}`;
export const RESET_SEARCH_STATE = createActionName('RESET_SEARCH_STATE');

export const DO_LOAD_DATA_STARTED = createActionName('LOAD_DATA_STARTED');
export const DO_LOAD_DATA_FINISHED = createActionName('LOAD_DATA_FINISHED');
export const DO_LOAD_DATA_FAILED = createActionName('LOAD_DATA_FAILED');

export const DO_LOAD_COUNT_STARTED = createActionName('LOAD_COUNT_STARTED');
export const DO_LOAD_COUNT_FINISHED = createActionName('LOAD_COUNT_FINISHED');
export const DO_LOAD_COUNT_FAILED = createActionName('LOAD_COUNT_FAILED');

export const DO_LOAD_SUGGESTIONS_STARTED = createActionName('LOAD_SUGGESTIONS_STARTED');
export const DO_LOAD_SUGGESTIONS_FINISHED = createActionName('LOAD_SUGGESTIONS_FINISHED');
export const DO_LOAD_SUGGESTIONS_FAILED = createActionName('LOAD_SUGGESTIONS_FAILED');

const hasNoValidResult = (data) => {
  if (isEmpty(data)) {
    return true;
  }

  return !data.count || data.count === 0;
};

function doLoadData({ searchProviderId, queryData, providers }) {
  return (dispatch) => {
    const idNormalized = searchProviderId.toLowerCase();

    const searchProvider = providers.find((provider) => provider.ID === idNormalized);
    if (searchProvider) {
      dispatch({
        type: DO_LOAD_DATA_STARTED,
        ID: idNormalized,
        queryData,
      });

      return searchProvider
        .execute_search(queryData)
        .then((data) => {
          if (hasNoValidResult(data)) {
            const nextProvider = findNextSearchProvider(providers, searchProviderId);
            if (nextProvider) {
              // start fetching for the next searchprovider
              const loadDataThunk = doLoadData({
                searchProviderId: nextProvider.ID,
                queryData,
                providers,
              });
              return loadDataThunk(dispatch);
            }
            // no searchprovider returned a resultset -> load suggestions
            const loadSuggestions = doLoadSuggestions({ queryData });
            return loadSuggestions(dispatch);
          }
          dispatch({
            type: DO_LOAD_DATA_FINISHED,
            ID: idNormalized,
            activeSearchProvider: searchProvider,
            queryData,
            data,
          });
          return data;
        })
        .catch((error) => {
          dispatch({
            type: DO_LOAD_DATA_FAILED,
            ID: idNormalized,
            activeSearchProvider: searchProvider,
            message: error.message || error,
          });
          return Promise.reject(error);
        });
    }

    return Promise.resolve();
  };
}

function doLoadCount({ searchProviderId, providers, queryData }) {
  return (dispatch) => {
    const idNormalized = searchProviderId.toLowerCase();

    const searchProvider = providers.find((provider) => provider.ID === idNormalized);

    dispatch({
      type: DO_LOAD_COUNT_STARTED,
      ID: idNormalized,
      queryData,
    });

    return searchProvider
      .execute_count(queryData)
      .then((data) => {
        dispatch({
          type: DO_LOAD_COUNT_FINISHED,
          ID: idNormalized,
          data,
        });
        return data;
      })
      .catch((error) => {
        dispatch({
          type: DO_LOAD_COUNT_FAILED,
          ID: idNormalized,
          message: error.message || error,
        });
        return Promise.reject(error);
      });
  };
}

function doLoadSuggestions({ queryData }) {
  return (dispatch) => {
    dispatch({
      type: DO_LOAD_SUGGESTIONS_STARTED,
    });

    const searchProviders = getSearchProviders();
    searchProviders.forEach((searchProvider) => {
      const idNormalized = searchProvider.ID.toLowerCase();
      searchProvider
        .execute_search(queryData)
        .then((data) => {
          dispatch({
            type: DO_LOAD_SUGGESTIONS_FINISHED,
            ID: idNormalized,
            data,
          });
        })
        .catch((error) => {
          dispatch({
            type: DO_LOAD_SUGGESTIONS_FAILED,
            ID: idNormalized,
            activeSearchProvider: searchProvider,
            message: error.message || error,
          });
          return Promise.reject(error);
        });
    });
    return Promise.resolve();
  };
}

const resetSearchState = () => ({
  type: RESET_SEARCH_STATE,
});

function findNextSearchProvider(providers, providerId) {
  const providerIdNormalized = providerId.toLowerCase();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < providers.length; i++) {
    if (providers[i].ID === providerIdNormalized) {
      if (providers[i + 1]) {
        return providers[i + 1];
      }
    }
  }
  return null;
}

export { doLoadData, doLoadCount, doLoadSuggestions, resetSearchState };
