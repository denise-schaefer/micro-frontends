import { registerSearchProvider } from 'search-api';
import search, { getValidActiveProvider } from '../reducers';
import { UPDATE_SEARCH_DATA, UPDATE_COUNT_DATA, SEARCH_ERROR, SET_LOADING_STATE } from '../actions';
import { testProvider } from '../../../testutil/searchContainer/TestSearchInitializer';

jest.dontMock('../reducers');

describe('search', () => {
  beforeAll(() => {
    registerSearchProvider({
      ID: 'PRODUCT',
      order: 1,
      execute_search: jest.fn(),
      execute_count: jest.fn(),
      handlePushHistory: jest.fn(),
      getNavComponent: jest.fn(),
      getTabComponent: jest.fn(),
      getResultComponent: jest.fn(),
    });
  });

  const initialState = {
    activeSearchProvider: {},
    displaySuggestions: false,
    errorState: {},
    loadingState: false,
    queryState: {},
    searchState: {},
  };

  it('should return the initial state', () => {
    expect(search(undefined, {})).toEqual(initialState);
  });

  it('should handle UPDATE_SEARCH_DATA', () => {
    const TEST_PROVIDER_ID = 'PRODUCT';
    const ORDER = 1;
    const searchResults = {
      count: 42,
      suggestions: ['suggestion 1', 'suggestion 2', 'suggestion 3'],
      result: ['result 1', 'result 2', 'result 3'],
    };
    const testProviderProduct = testProvider(TEST_PROVIDER_ID, ORDER);
    const action = {
      type: UPDATE_SEARCH_DATA,
      ID: TEST_PROVIDER_ID,
      activeSearchProvider: testProviderProduct,
      data: searchResults,
    };
    const expectedState = {
      ...initialState,
      queryState: {
        PRODUCT: {
          searchType: TEST_PROVIDER_ID.toLowerCase(),
        },
      },
      searchState: {
        PRODUCT: { ...searchResults },
      },
      activeSearchProvider: testProviderProduct,
      errorState: {
        PRODUCT: {
          error: false,
          message: '',
        },
      },
    };
    expect(search(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_COUNT_DATA', () => {
    const TEST_PROVIDER_ID = 'PRODUCT';
    const searchResults = {
      count: 33,
    };
    const action = {
      type: UPDATE_COUNT_DATA,
      ID: TEST_PROVIDER_ID,
      data: searchResults,
    };
    const expectedState = {
      ...initialState,
      searchState: {
        PRODUCT: { ...searchResults },
      },
      errorState: {
        PRODUCT: {
          error: false,
          message: '',
        },
      },
    };
    expect(search(initialState, action)).toEqual(expectedState);
  });

  it('should handle SEARCH_ERROR', () => {
    const TEST_PROVIDER_ID = 'PRODUCT';
    const ERROR_MESSAGE = 'error';
    const ORDER = 3;
    const testProviderProduct = testProvider(TEST_PROVIDER_ID, ORDER);
    const action = {
      type: SEARCH_ERROR,
      ID: TEST_PROVIDER_ID,
      activeSearchProvider: testProviderProduct,
      message: ERROR_MESSAGE,
    };
    const expectedState = {
      ...initialState,
      searchState: {
        PRODUCT: {},
      },
      activeSearchProvider: null,
      errorState: {
        PRODUCT: {
          error: true,
          message: ERROR_MESSAGE,
        },
      },
    };
    expect(search(initialState, action)).toEqual(expectedState);
  });

  it('should handle SEARCH_COUNT_ERROR', () => {
    const TEST_PROVIDER_ID = 'PRODUCT';
    const ERROR_MESSAGE = 'error';
    const action = {
      type: SEARCH_ERROR,
      ID: TEST_PROVIDER_ID,
      message: ERROR_MESSAGE,
    };
    const expectedState = {
      ...initialState,
      searchState: {
        PRODUCT: {},
      },
      errorState: {
        PRODUCT: {
          error: true,
          message: ERROR_MESSAGE,
        },
      },
    };
    expect(search(initialState, action)).toEqual(expectedState);
  });

  it('should handle SET_SEARCH_LOADING_STATE', () => {
    const action = {
      type: SET_LOADING_STATE,
      isLoading: true,
    };
    const expectedState = {
      ...initialState,
      loadingState: true,
    };
    expect(search(initialState, action)).toEqual(expectedState);
  });

  const searchProviders = [testProvider('PRODUCT', 1), testProvider('CONTENT', 2)];

  const searchState = { CONTENT: { count: 42 } };

  const verfiyThatActiveSearchProviderIs = (activeSearchProvider, provider, order) => {
    expect(activeSearchProvider.ID).toEqual(provider);
    expect(activeSearchProvider.order).toEqual(order);
  };

  it('getValidActiveProvider if current provider is active and has valid data ', () => {
    const current = {
      ID: 'PRODUCT',
      data: { count: 3070, suggestions: ['hello', 'world'], result: ['a', 'b', 'c'] },
      activeProvider: testProvider('PRODUCT', 1),
    };

    const activeSearchProvider = getValidActiveProvider(current, searchState, searchProviders);
    verfiyThatActiveSearchProviderIs(activeSearchProvider, 'PRODUCT', 1);
  });

  it('getValidActiveProvider if current provider is active and has zero counts', () => {
    const current = {
      ID: 'PRODUCT',
      data: { count: 0, suggestions: ['hello', 'world'], result: [] },
      activeProvider: testProvider('PRODUCT', 1),
    };

    const activeSearchProvider = getValidActiveProvider(current, searchProviders, searchState);
    verfiyThatActiveSearchProviderIs(activeSearchProvider, 'CONTENT', 2);
  });

  it('getValidActiveProvider if current provider is active and has empty data', () => {
    const current = {
      ID: 'PRODUCT',
      data: {},
      activeProvider: testProvider('PRODUCT', 1),
    };

    const activeSearchProvider = getValidActiveProvider(current, searchProviders, searchState);
    verfiyThatActiveSearchProviderIs(activeSearchProvider, 'CONTENT', 2);
  });

  it('getValidActiveProvider if current provider is active and has no data', () => {
    const current = {
      ID: 'PRODUCT',
      activeProvider: testProvider('PRODUCT', 1),
    };

    const activeSearchProvider = getValidActiveProvider(current, searchProviders, searchState);
    verfiyThatActiveSearchProviderIs(activeSearchProvider, 'CONTENT', 2);
  });

  // we have an invalid search result here, but count is valid -> product search is responsible for
  // consistent data structure itself in this use case
  it('getValidActiveProvider if current provider is active and has counts, but empty results', () => {
    const current = {
      ID: 'PRODUCT',
      data: { count: 3070, suggestions: ['hello', 'world'], result: [] },
      activeProvider: testProvider('PRODUCT', 1),
    };

    const activeSearchProvider = getValidActiveProvider(current, searchProviders, searchState);
    verfiyThatActiveSearchProviderIs(activeSearchProvider, 'PRODUCT', 1);
  });

  it('getValidActiveProvider if current provider is active and all providers have zero counts', () => {
    const current = {
      ID: 'PRODUCT',
      data: { count: 0, suggestions: ['hello', 'world'], result: [] },
      activeProvider: testProvider('PRODUCT', 1),
    };

    const searchStateWithZeroCounts = { CONTENT: { count: 0 } };

    const activeSearchProvider = getValidActiveProvider(
      current,
      searchProviders,
      searchStateWithZeroCounts
    );
    expect(activeSearchProvider).toBeNull();
  });

  it('getValidActiveProvider if current provider is not active provider', () => {
    const current = {
      ID: 'PRODUCT',
      data: { count: 0, suggestions: ['hello', 'world'], result: [] },
      activeProvider: testProvider('CONTENT', 2),
    };

    const activeSearchProvider = getValidActiveProvider(current, searchProviders, {});
    verfiyThatActiveSearchProviderIs(activeSearchProvider, 'CONTENT', 2);
  });

  it('getValidActiveProvider if current provider, search state and search providers are null', () => {
    const current = null;

    const activeSearchProvider = getValidActiveProvider(current, null, null);
    expect(activeSearchProvider).toBeNull();
  });
});
