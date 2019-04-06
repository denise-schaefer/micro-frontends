import React from 'react';
import PropTypes from 'prop-types';
import SearchError from './SearchError';
import SearchFallback from './SearchFallback';
import isEmpty from '../../util/isEmpty';
import getObjectValues from '../../util/getObjectValues';

const SearchResultBody = props => {
  const {
    activeSearchProvider,
    fetchData,
    errorState,
    queryData,
    searchFallback,
    searchState,
    handleUpdateSuggestions,
  } = props;

  const getResultFor = searchProvider => {
    const data = !isEmpty(searchProvider) ? searchState[searchProvider.ID] : undefined;

    if (!data) {
      return queryData && queryData.query ? <div>Loading...</div> : null;
    }

    return (
      <div data-dmid="search-results">
        {searchProvider.getResultComponent(queryData, data, fetchData)}
      </div>
    );
  };

  const renderSearchResultBody = () => {
    if (!isEmpty(errorState)) {
      const error = getObjectValues(errorState).reduce((acc, curr) => curr.error && acc, true);

      if (error) {
        return <SearchError />;
      }
    }

    // activeSearchProvider is null in case of search fallback,
    // otherwise undefined or empty object
    if (activeSearchProvider !== null) {
      return getResultFor(activeSearchProvider);
    }

    return (
      <SearchFallback
        query={queryData.query}
        searchFallback={searchFallback}
        searchState={searchState}
        handleUpdateSuggestions={handleUpdateSuggestions}
      />
    );
  };

  return <div data-dmid="search-body">{renderSearchResultBody()}</div>;
};

SearchResultBody.propTypes = {
  queryData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  searchFallback: PropTypes.object,
  searchState: PropTypes.object,
  errorState: PropTypes.object,
  activeSearchProvider: PropTypes.object,
  handleUpdateSuggestions: PropTypes.func.isRequired,
};

export default SearchResultBody;
