/* eslint import/prefer-default-export: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';
import Loading from '@dm/loading';
import { compose } from 'recompose';
import { connect as connectFela } from '@dm/style-provider';
import { withGlobalConfig } from '@dm/global-config-provider';
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

const readQueryDataFromUrl = () => {
  const queryString = window.location.search;
  let queryData;
  if (queryString) {
    queryData = qs.parse(queryString.substring(1, queryString.length));
  }
  return queryData;
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
      queryData,
      providers: searchProviders,
    });
  };

  submitSearch = (activeSearchProviderID, queryData) => {
    handlePushHistory({ ...queryData, searchType: activeSearchProviderID });
    this.handleSearch(activeSearchProviderID, queryData);
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
      styles,
    } = this.props;

    const queryData = readQueryDataFromUrl();

    return (
      <div>
        <SearchInput
          onSubmit={query => this.submitSearch(activeSearchProvider.ID, query)}
          value={queryData && queryData.query}
        />
        {activeSearchProvider && this.getQueryData(activeSearchProvider) && (
          <div data-dmid="search-container" className={styles.searchContainer}>
            {activeSearchProvider.getNavComponent && (
              <SearchNavigation
                activeSearchProvider={activeSearchProvider}
                queryData={this.getQueryData(activeSearchProvider)}
                searchState={searchState}
                fetchData={this.fetchData}
              />
            )}
            <div data-dmid="search-content-container" className={styles.searchContentContainer}>
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
            </div>
            {loadingState && <Loading />}
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loadData: (...args) => doLoadData(...args)(dispatch),
  loadCount: (...args) => doLoadCount(...args)(dispatch),
  loadSuggestions: (...args) => doLoadSuggestions(...args)(dispatch),
  setActiveSearchProvider: (...args) => dispatch(setActiveSearchProvider(...args)),
});

const searchContainer = ({ theme }) => ({
  position: 'relative',
  display: 'flex',
  maxWidth: theme.dimension.contentSize.l.px,
  margin: `${theme.dimension.spacing.xl.rem} auto 0`,
  padding: `0 ${theme.dimension.spacing.xs.rem}`,
  column2to6: {
    margin: `${theme.dimension.spacing.xs.rem} auto 0`,
    padding: '0',
  },
});

const searchContentContainer = () => ({
  flex: '1 0 0px',
});

UnconnectedSearchContainer.propTypes = {
  // fela props
  styles: PropTypes.object,
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
  // ConfigProvider
  getConfig: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
};

export default compose(
  withGlobalConfig,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  connectFela({ searchContainer, searchContentContainer })
)(UnconnectedSearchContainer);
