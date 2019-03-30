import expect from 'expect';
import {
  UPDATE_SEARCH_DATA,
  UPDATE_COUNT_DATA,
  SEARCH_ERROR,
  SEARCH_COUNT_ERROR,
  updateSearchData,
  updateCountData,
  searchError,
  searchCountError,
  SET_LOADING_STATE,
  setLoadingState,
} from '../actions';
import { testProvider } from '../../../testutil/searchContainer/TestSearchInitializer';

describe('actions', () => {
  describe('updateSearchData', () => {
    it('should create an action to update search data', () => {
      const TEST_PROVIDER_ID = 'PRODUCT';
      const ORDER = 1;
      const searchResults = {
        count: 42,
        suggestions: ['suggestion 1', 'suggestion 2', 'suggestion 3'],
        results: ['result 1', 'result 2', 'result 3'],
      };
      const TEST_PROVIDER = testProvider(TEST_PROVIDER_ID, ORDER);
      const QUERY_DATA = {
        locale: 'de',
        country: 'DE',
        site: 'de_mcr',
        targetSystem: '',
        stagingSystem: '',
        servicesGatewayUrl: 'https://services-stage.dm-drogeriemarkt.com',
        query: 'bio',
        searchType: 'product',
        parametersProductSearch: {
          categoryId: '',
          initialQuery: '',
          productQuery: '',
          hiddenFacets: '',
          currentPage: 1,
          pageSize: 24,
          sort: 'relevance',
        },
      };
      const expectedAction = {
        type: UPDATE_SEARCH_DATA,
        ID: TEST_PROVIDER_ID,
        activeSearchProvider: TEST_PROVIDER,
        data: searchResults,
        queryData: QUERY_DATA,
      };
      expect(updateSearchData(TEST_PROVIDER_ID, TEST_PROVIDER, QUERY_DATA, searchResults)).toEqual(
        expectedAction
      );
    });
  });
  describe('updateCountData', () => {
    it('should create an action to update count data', () => {
      const TEST_PROVIDER_ID = 'PRODUCT';
      const searchResults = {
        count: 66,
      };
      const expectedAction = {
        type: UPDATE_COUNT_DATA,
        ID: TEST_PROVIDER_ID,
        data: searchResults,
      };
      expect(updateCountData(TEST_PROVIDER_ID, searchResults)).toEqual(expectedAction);
    });
  });
  describe('searchError', () => {
    it('should create an action to throw search error', () => {
      const TEST_PROVIDER_ID = 'PRODUCT';
      const ERROR_MESSAGE = 'error';
      const ORDER = 1;
      const testProviderProduct = testProvider(TEST_PROVIDER_ID, ORDER);
      const expectedAction = {
        type: SEARCH_ERROR,
        ID: TEST_PROVIDER_ID,
        activeSearchProvider: testProviderProduct,
        message: ERROR_MESSAGE,
      };
      expect(searchError(TEST_PROVIDER_ID, testProviderProduct, ERROR_MESSAGE)).toEqual(
        expectedAction
      );
    });
  });
  describe('searchCountError', () => {
    it('should create an action to throw search count error', () => {
      const TEST_PROVIDER_ID = 'PRODUCT';
      const ERROR_MESSAGE = 'error';
      const expectedAction = {
        type: SEARCH_COUNT_ERROR,
        ID: TEST_PROVIDER_ID,
        message: ERROR_MESSAGE,
      };
      expect(searchCountError(TEST_PROVIDER_ID, ERROR_MESSAGE)).toEqual(expectedAction);
    });
  });

  describe('setSearchLoadingState', () => {
    it('should create an action to set search loading state', () => {
      const expectedAction = {
        type: SET_LOADING_STATE,
        isLoading: true,
      };
      expect(setLoadingState(true)).toEqual(expectedAction);
    });
  });
});
