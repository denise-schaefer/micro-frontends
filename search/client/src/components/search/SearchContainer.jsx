/* eslint import/prefer-default-export: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from '@dm/loading';
import { compose } from 'recompose';
import { connect as connectFela } from '@dm/style-provider';
import { withGlobalConfig } from '@dm/global-config-provider';
import { getSearchProviders } from 'search-api';
import SearchResultHeader from './SearchResultHeader';
import SearchResultBody from './SearchResultBody';
import SearchNavigation from './SearchNavigation';
import {
  searchCountError,
  searchError,
  setActiveSearchProvider,
  setDisplaySuggestions,
  setLoadingState,
  updateCountData,
  updateSearchData,
  updateSuggestions,
} from './redux/actions';
import { structuredSelector as mapStateToProps } from './redux/reducers';
import isEmpty from '../../util/isEmpty';
import SearchInput from './SearchInput';

export class UnconnectedSearchContainer extends Component {
  componentDidMount() {
    // type is inconsistent with searchType, should be refactored, see MCR-7911
    const searchType = this.props.queryData ? this.props.queryData.searchType : '';
    const activeSearchProvider = this.getActiveSearchProvider(searchType);
    // update query data from store
    const queryData = this.getQueryData(activeSearchProvider);
    this.props.setActiveSearchProvider(activeSearchProvider);
    const searchProviders = getSearchProviders();

    searchProviders
      .filter(provider => provider.ID !== activeSearchProvider.ID)
      .forEach(provider =>
        provider
          .execute_count(queryData)
          .then(data => this.props.updateCountData(provider.ID, data))
          .catch(error => {
            const errorMessage = error.message || error;
            this.props.searchCountError(provider.ID, errorMessage);
          })
      );

    this.handleSearch(activeSearchProvider, queryData);

    window.addEventListener('popstate', this.handleHistoryPopState);

    this.unsubscribeListeners = () => {
      window.removeEventListener('popstate', this.handleHistoryPopState);
    };
  }

  componentWillReceiveProps(nextProps) {
    const { activeSearchProvider } = this.props;
    const nextActive = nextProps.activeSearchProvider;

    // in error case and if zero search results we have to
    // execute search again for new active search provider
    if (
      !isEmpty(activeSearchProvider) &&
      nextActive &&
      activeSearchProvider.ID !== nextActive.ID &&
      this.hasActiveNoResultOrError(activeSearchProvider, nextProps)
    ) {
      const queryData = this.getQueryData(nextActive);
      this.handleSearch(nextActive, queryData);
    }
  }

  componentWillUnmount() {
    this.unsubscribeListeners();
  }

  onTabClick = searchProvider => {
    if (searchProvider.handlePushHistory) {
      searchProvider.handlePushHistory(this.getQueryData(searchProvider));
    }
    this.handleSearch(searchProvider, this.getQueryData(searchProvider));
  };

  getActiveSearchProvider = searchType => {
    const searchProviders = getSearchProviders();

    const activeSearchProviderFromSearchType = searchProviders.filter(
      searchProvider => searchType && searchProvider.ID === searchType.toUpperCase()
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
    // type is inconsistent with searchType, should be refactored, see MCR-7911
    const searchType = queryData ? queryData.searchType : '';
    const activeSearchProvider = this.getActiveSearchProvider(searchType);
    this.handleSearch(activeSearchProvider, queryData);
  };

  hasActiveNoResultOrError = (activeSearchProvider, nextProps) => {
    const { searchState, errorState } = nextProps;
    const searchStateActiveProvider = searchState[activeSearchProvider.ID];
    const errorStateActiveProvider = errorState[activeSearchProvider.ID];
    return (
      (searchStateActiveProvider && searchStateActiveProvider.count === 0) ||
      (errorStateActiveProvider && errorStateActiveProvider.error)
    );
  };

  handleUpdateSuggestions = () => {
    if (!this.props.displaySuggestions) {
      this.props.setDisplaySuggestions(true);

      const searchProviders = getSearchProviders();

      searchProviders.forEach(searchProvider =>
        searchProvider
          .execute_search(this.props.queryData)
          .then(data => {
            this.props.updateSuggestions(searchProvider.ID, data);
            this.props.setLoadingState(false);
            return Promise.resolve();
          })
          .catch(error => {
            const errorMessage = error.message || error;
            this.props.searchError(searchProvider.ID, searchProvider, errorMessage);
            return Promise.reject(error);
          })
      );
    }
  };

  handleSearch = (activeSearchProvider, queryData) => {
    this.props.setLoadingState(true);
    this.props.setDisplaySuggestions(false);
    activeSearchProvider
      .execute_search(queryData)
      .then(data => {
        this.props.updateSearchData(activeSearchProvider.ID, activeSearchProvider, queryData, data);
        this.props.setLoadingState(false);
        return Promise.resolve();
      })
      .catch(error => {
        const errorMessage = error.message || error;
        this.props.searchError(activeSearchProvider.ID, activeSearchProvider, errorMessage);
        return Promise.reject(error);
      });
  };

  handleHistoryPopState = event => {
    const newState = event.state;

    if (newState) {
      // type is inconsistent with searchType, should be refactored, see MCR-7911
      const searchType = newState.type;
      if (searchType && searchType.toUpperCase() !== this.props.activeSearchProvider.ID) {
        const activeSearchProvider = this.getActiveSearchProvider(searchType);
        this.props.setActiveSearchProvider(activeSearchProvider);
      }
    } else {
      const searchProviders = getSearchProviders();
      this.props.setActiveSearchProvider(searchProviders[0]);
    }
  };

  render() {
    const {
      searchFallback,
      activeSearchProvider,
      searchState,
      errorState,
      loadingState,
      styles,
    } = this.props;

    return (
      <div>
        <SearchInput
          onSubmit={data => this.handleSearch(data)}
          value={this.getQueryData(activeSearchProvider).query}
        />
        <div data-dmid="search-container" className={styles.searchContainer}>
          {activeSearchProvider && activeSearchProvider.getNavComponent && (
            <SearchNavigation
              activeSearchProvider={activeSearchProvider}
              queryData={this.getQueryData(activeSearchProvider)}
              searchState={searchState}
              fetchData={this.fetchData}
            />
          )}
          <div data-dmid="search-content-container" className={styles.searchContentContainer}>
            {activeSearchProvider && (
              <SearchResultHeader
                query={this.getQueryData(activeSearchProvider).query}
                activeSearchProvider={activeSearchProvider}
                searchState={searchState}
                onTabClick={searchProvider => this.onTabClick(searchProvider)}
              />
            )}
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
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateSearchData: (ID, activeSearchProvider, queryData, data) => {
    dispatch(updateSearchData(ID, activeSearchProvider, queryData, data));
  },
  updateCountData: (ID, data) => {
    dispatch(updateCountData(ID, data));
  },
  updateSuggestions: (ID, data) => {
    dispatch(updateSuggestions(ID, data));
  },
  searchError: (ID, activeSearchProvider, errorMessage) => {
    dispatch(searchError(ID, activeSearchProvider, errorMessage));
  },
  searchCountError: (ID, errorMessage) => {
    dispatch(searchCountError(ID, errorMessage));
  },
  setLoadingState: isLoading => {
    dispatch(setLoadingState(isLoading));
  },
  setDisplaySuggestions: displaySuggestions => {
    dispatch(setDisplaySuggestions(displaySuggestions));
  },
  setActiveSearchProvider: activeSearchProvider => {
    dispatch(setActiveSearchProvider(activeSearchProvider));
  },
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
  queryData: PropTypes.object.isRequired,
  // props from store
  searchState: PropTypes.object,
  errorState: PropTypes.object,
  queryState: PropTypes.object,
  loadingState: PropTypes.bool,
  displaySuggestions: PropTypes.bool,
  activeSearchProvider: PropTypes.object,
  updateSearchData: PropTypes.func.isRequired,
  updateCountData: PropTypes.func.isRequired,
  updateSuggestions: PropTypes.func.isRequired,
  searchError: PropTypes.func.isRequired,
  searchCountError: PropTypes.func.isRequired,
  setLoadingState: PropTypes.func.isRequired,
  setDisplaySuggestions: PropTypes.func.isRequired,
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
