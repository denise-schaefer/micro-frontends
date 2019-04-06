import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';
import { getSearchProviders } from 'search-api';
import SearchResultHeader from './SearchResultHeader';
import SearchResultBody from './SearchResultBody';
import SearchNavigation from './SearchNavigation';
import {
  doLoadData,
  doLoadCount,
  doLoadSuggestions,
  setActiveSearchProvider,
} from './redux/actions';
import { structuredSelector as mapStateToProps } from './redux/reducers';
import isEmpty from '../../util/isEmpty';
import SearchInput from './SearchInput';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

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

export class UnconnectedSearchContainer extends Component {
  componentDidMount() {
    const queryData = readQueryDataFromUrl();
    const searchProviders = getSearchProviders();
    if (queryData) {
      this.handleSearch(queryData.searchType || searchProviders[0].ID, queryData);
    } else {
      this.props.setActiveSearchProvider(searchProviders[0]);
    }
    window.addEventListener('popstate', this.handleHistoryPopState);

    this.unsubscribeListeners = () => {
      window.removeEventListener('popstate', this.handleHistoryPopState);
    };
  }

  componentWillUnmount() {
    this.unsubscribeListeners();
  }

  onTabClick = searchProvider => {
    handlePushHistory(this.getQueryData(searchProvider));
    this.handleSearch(searchProvider.ID, this.getQueryData(searchProvider));
  };

  getActiveSearchProvider = searchType => {
    const searchProviders = getSearchProviders();

    const activeSearchProviderFromSearchType = searchProviders.filter(
      searchProvider => searchType && searchProvider.ID === searchType.toLowerCase()
    )[0];

    return activeSearchProviderFromSearchType || searchProviders[0];
  };

  getQueryData = searchProvider => {
    const { queryState } = this.props;
    return !isEmpty(queryState) && searchProvider && !isEmpty(queryState[searchProvider.ID])
      ? queryState[searchProvider.ID]
      : this.props.queryData;
  };

  fetchData = queryData => {
    const searchType = queryData ? queryData.searchType : '';
    const activeSearchProvider = this.getActiveSearchProvider(searchType);
    handlePushHistory(queryData);
    this.handleSearch(activeSearchProvider.ID, queryData);
  };

  handleUpdateSuggestions = () => {
    if (!this.props.displaySuggestions) {
      const searchProviders = getSearchProviders();

      searchProviders.forEach(searchProvider =>
        this.props.loadSuggestions({
          searchProviderId: searchProvider.ID,
          queryData: this.props.queryData,
        })
      );
    }
  };

  handleSearch = (activeSearchProviderID, queryData) => {
    const searchProviders = getSearchProviders();

    searchProviders.forEach(provider => {
      this.props.loadCount({
        searchProviderId: provider.ID,
        providers: searchProviders,
        queryData,
      });
    });

    this.props.loadData({
      searchProviderId: activeSearchProviderID,
      providers: searchProviders,
      queryData,
    });
  };

  submitSearch = (activeSearchProviderID, queryData) => {
    this.handleSearch(activeSearchProviderID, queryData);
    handlePushHistory({ ...queryData, searchType: activeSearchProviderID });
  };

  handleHistoryPopState = event => {
    const newState = event.state;

    if (newState) {
      const searchType = newState.searchType;
      const query = newState.query;
      const activeSearchProvider = this.getActiveSearchProvider(searchType);
      this.handleSearch(activeSearchProvider.ID, {
        ...this.getQueryData(activeSearchProvider),
        query,
      });
    } else {
      const activeSearchProvider = getSearchProviders()[0];
      this.handleSearch(activeSearchProvider[0].ID, this.getQueryData(activeSearchProvider));
    }
  };

  render() {
    const {
      searchFallback,
      activeSearchProvider,
      searchState,
      countState,
      errorState,
      loadingState,
    } = this.props;

    const queryData = readQueryDataFromUrl();

    return (
      <Container>
        <Navbar className="bg-light justify-content-between" style={{ marginBottom: '20px' }}>
          <Navbar.Brand>micro-frontends</Navbar.Brand>
          <SearchInput
            onSubmit={query => this.submitSearch(activeSearchProvider.ID, query)}
            value={queryData && queryData.query}
          />
        </Navbar>
        {activeSearchProvider && this.getQueryData(activeSearchProvider) && (
          <Row>
            <Col xs={6} md={4}>
              {activeSearchProvider.getNavComponent && (
                <SearchNavigation
                  activeSearchProvider={activeSearchProvider}
                  queryData={this.getQueryData(activeSearchProvider)}
                  searchState={searchState}
                  fetchData={this.fetchData}
                />
              )}
            </Col>
            <Col xs={12} md={8}>
              <SearchResultHeader
                query={this.getQueryData(activeSearchProvider).query}
                activeSearchProvider={activeSearchProvider}
                countState={countState}
                onTabClick={searchProvider => this.onTabClick(searchProvider)}
              />
              <SearchResultBody
                activeSearchProvider={activeSearchProvider}
                fetchData={this.fetchData}
                errorState={errorState}
                queryData={this.getQueryData(activeSearchProvider)}
                searchState={searchState}
                searchFallback={searchFallback}
                handleUpdateSuggestions={this.handleUpdateSuggestions}
              />
            </Col>
            {loadingState && <div>Loading...</div>}
          </Row>
        )}
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadData: (...args) => doLoadData(...args)(dispatch),
  loadCount: (...args) => doLoadCount(...args)(dispatch),
  loadSuggestions: (...args) => doLoadSuggestions(...args)(dispatch),
  setActiveSearchProvider: (...args) => dispatch(setActiveSearchProvider(...args)),
});

UnconnectedSearchContainer.propTypes = {
  // own props
  searchFallback: PropTypes.object,
  queryData: PropTypes.shape({
    query: PropTypes.string,
    searchType: PropTypes.string,
    ...PropTypes.object,
  }).isRequired,
  // props from store
  searchState: PropTypes.object,
  countState: PropTypes.object,
  errorState: PropTypes.object,
  queryState: PropTypes.object,
  loadingState: PropTypes.bool,
  displaySuggestions: PropTypes.bool,
  activeSearchProvider: PropTypes.object,
  loadData: PropTypes.func.isRequired,
  loadCount: PropTypes.func.isRequired,
  loadSuggestions: PropTypes.func.isRequired,
  setActiveSearchProvider: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedSearchContainer);
