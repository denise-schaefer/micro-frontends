import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';
import { getSearchProviders } from 'search-api';
import SearchResultHeader from './SearchResultHeader';
import SearchResultBody from './SearchResultBody';
import { doLoadData, doLoadCount, setActiveSearchProvider } from './redux/actions';
import { structuredSelector as mapStateToProps } from './redux/reducers';
import isEmpty from '../../util/isEmpty';
import SearchInput from './SearchInput';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import SearchFallback from './SearchFallback';

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
      activeSearchProvider,
      searchState,
      countState,
      errorState,
      loadingState,
      displaySuggestions,
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
        {!displaySuggestions && activeSearchProvider && this.getQueryData(activeSearchProvider) && (
          <Col style={{ justifyContent: 'center' }}>
            <Row className="justify-content-center">
              <SearchResultHeader
                query={this.getQueryData(activeSearchProvider).query}
                activeSearchProvider={activeSearchProvider}
                countState={countState}
                onTabClick={searchProvider => this.onTabClick(searchProvider)}
              />
            </Row>
            <Row className="justify-content-center">
              <SearchResultBody
                activeSearchProvider={activeSearchProvider}
                fetchData={this.fetchData}
                errorState={errorState}
                queryData={this.getQueryData(activeSearchProvider)}
                searchState={searchState}
              />
            </Row>
          </Col>
        )}
        {displaySuggestions && <SearchFallback query={queryData.query} searchState={searchState} />}
        {loadingState && <div>Loading...</div>}
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadData: (...args) => doLoadData(...args)(dispatch),
  loadCount: (...args) => doLoadCount(...args)(dispatch),
  setActiveSearchProvider: (...args) => dispatch(setActiveSearchProvider(...args)),
});

UnconnectedSearchContainer.propTypes = {
  // own props
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
  setActiveSearchProvider: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedSearchContainer);
