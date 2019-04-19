import React, { useEffect } from 'react';
import qs from 'qs';
import { getSearchProviders } from 'search-api/lib';
import SearchResultHeader from './SearchResultHeader';
import SearchResultBody from './SearchResultBody';
import { doLoadCount, doLoadData } from './state/actions';
import isEmpty from '../util/isEmpty';
import { SearchInput } from './SearchInput';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import SearchFallback from './SearchFallback';
import search from './state/reducers';
import useThunkReducer from '../util/useThunkReducer';

const readQueryDataFromUrl = () => {
  const queryString = window.location.search;
  return queryString ? qs.parse(queryString.substring(1, queryString.length)) : null;
};

const handlePushHistory = queryData => {
  const queryString = `?${qs.stringify(queryData, {
    encode: false,
    indices: false,
  })}`;

  window.history.pushState({ ...queryData }, null, queryString);
};

const getActiveSearchProvider = searchType => {
  const searchProviders = getSearchProviders();

  const activeSearchProviderFromSearchType = searchProviders.filter(
    searchProvider => searchType && searchProvider.ID === searchType.toLowerCase()
  )[0];

  return activeSearchProviderFromSearchType || searchProviders[0];
};

export default function SearchContainer() {
  const searchProviders = getSearchProviders();

  const [state, dispatch] = useThunkReducer(search, {
    searchState: {},
    countState: {},
    errorState: {},
    queryState: {},
    activeSearchProvider: searchProviders[0],
    loadingState: false,
    displaySuggestions: false,
  });

  const {
    activeSearchProvider,
    searchState,
    queryState,
    countState,
    errorState,
    loadingState,
    displaySuggestions,
  } = state;

  const getQueryData = searchProvider => {
    return !isEmpty(queryState) && searchProvider && !isEmpty(queryState[searchProvider.ID])
      ? queryState[searchProvider.ID]
      : null;
  };

  const handleSearch = (activeSearchProviderID, queryData) => {
    const searchProviders = getSearchProviders();

    searchProviders.forEach(provider => {
      dispatch(
        doLoadCount({
          searchProviderId: provider.ID,
          providers: searchProviders,
          queryData,
        })
      );
    });

    dispatch(
      doLoadData({
        searchProviderId: activeSearchProviderID,
        providers: searchProviders,
        queryData,
      })
    );
  };

  const onTabClick = searchProvider => {
    handlePushHistory(getQueryData(searchProvider));
    handleSearch(searchProvider.ID, getQueryData(searchProvider));
  };

  const fetchData = queryData => {
    const searchType = queryData ? queryData.searchType : '';
    const activeSearchProvider = getActiveSearchProvider(searchType);
    handlePushHistory(queryData);
    handleSearch(activeSearchProvider.ID, queryData);
  };

  const submitSearch = (activeSearchProviderID, queryData) => {
    handleSearch(activeSearchProviderID, queryData);
    handlePushHistory({ ...queryData, searchType: activeSearchProviderID });
  };

  useEffect(() => {
    const handleHistoryPopState = event => {
      const newState = event.state;

      if (newState) {
        const searchType = newState.searchType;
        const query = newState.query;
        const activeSearchProvider = getActiveSearchProvider(searchType);
        handleSearch(activeSearchProvider.ID, {
          ...getQueryData(activeSearchProvider),
          query,
        });
      } else {
        const activeSearchProvider = getSearchProviders()[0];
        handleSearch(activeSearchProvider[0].ID, getQueryData(activeSearchProvider));
      }
    };

    const queryData = readQueryDataFromUrl();
    const searchProviders = getSearchProviders();
    if (queryData) {
      handleSearch(queryData.searchType || searchProviders[0].ID, queryData);
    }
    window.addEventListener('popstate', handleHistoryPopState);

    return () => {
      window.removeEventListener('popstate', handleHistoryPopState);
    };
  }, []);

  const queryDataFromUrl = readQueryDataFromUrl();

  return (
    <Container>
      <Navbar className="bg-light justify-content-between" style={{ marginBottom: '20px' }}>
        <Navbar.Brand>micro-frontends</Navbar.Brand>
        <SearchInput
          onSubmit={query => submitSearch(activeSearchProvider.ID, query)}
          query={queryDataFromUrl && queryDataFromUrl.query}
        />
      </Navbar>
      {!displaySuggestions && activeSearchProvider && getQueryData(activeSearchProvider) && (
        <Col style={{ justifyContent: 'center' }}>
          <Row className="justify-content-center">
            <SearchResultHeader
              query={getQueryData(activeSearchProvider).query}
              activeSearchProvider={activeSearchProvider}
              countState={countState}
              onTabClick={searchProvider => onTabClick(searchProvider)}
            />
          </Row>
          <Row className="justify-content-center">
            <SearchResultBody
              activeSearchProvider={activeSearchProvider}
              fetchData={fetchData}
              errorState={errorState}
              queryData={getQueryData(activeSearchProvider)}
              searchState={searchState}
            />
          </Row>
        </Col>
      )}
      {displaySuggestions && (
        <SearchFallback query={queryDataFromUrl.query} searchState={searchState} />
      )}
      {loadingState && <div>Loading...</div>}
    </Container>
  );
}
