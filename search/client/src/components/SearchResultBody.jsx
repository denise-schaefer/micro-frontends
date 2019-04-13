import React from 'react';
import PropTypes from 'prop-types';
import SearchError from './SearchError';
import isEmpty from '../util/isEmpty';
import getObjectValues from '../util/getObjectValues';

const SearchResultBody = props => {
  const { activeSearchProvider, fetchData, errorState, queryData, searchState } = props;

  if (!isEmpty(errorState)) {
    const error = getObjectValues(errorState).reduce((acc, curr) => curr.error && acc, true);

    if (error) {
      return <SearchError />;
    }
  }

  const data = !isEmpty(activeSearchProvider) ? searchState[activeSearchProvider.ID] : undefined;

  if (!data) {
    return queryData && queryData.query ? <div>Loading...</div> : null;
  }

  return <div>{activeSearchProvider.getResultComponent(queryData, data, fetchData)}</div>;
};

SearchResultBody.propTypes = {
  queryData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  searchState: PropTypes.object,
  errorState: PropTypes.object,
  activeSearchProvider: PropTypes.object,
};

export default SearchResultBody;
