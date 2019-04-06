import React from 'react';
import PropTypes from 'prop-types';
import SearchError from './SearchError';
import isEmpty from '../../util/isEmpty';
import getObjectValues from '../../util/getObjectValues';

const SearchResultBody = props => {
  const { activeSearchProvider, fetchData, errorState, queryData, searchState } = props;

  const getResultFor = searchProvider => {
    const data = !isEmpty(searchProvider) ? searchState[searchProvider.ID] : undefined;

    if (!data) {
      return queryData && queryData.query ? <div>Loading...</div> : null;
    }

    return <div>{searchProvider.getResultComponent(queryData, data, fetchData)}</div>;
  };

  const renderSearchResultBody = () => {
    if (!isEmpty(errorState)) {
      const error = getObjectValues(errorState).reduce((acc, curr) => curr.error && acc, true);

      if (error) {
        return <SearchError />;
      }
    }

    return getResultFor(activeSearchProvider);
  };

  return <div>{renderSearchResultBody()}</div>;
};

SearchResultBody.propTypes = {
  queryData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  searchState: PropTypes.object,
  errorState: PropTypes.object,
  activeSearchProvider: PropTypes.object,
};

export default SearchResultBody;
