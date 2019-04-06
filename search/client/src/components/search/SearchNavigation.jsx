import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../util/isEmpty';

const SearchNavigation = props => {
  const { activeSearchProvider, queryData, searchState, fetchData } = props;

  if (isEmpty(activeSearchProvider)) {
    return null;
  }

  const data = searchState[activeSearchProvider.ID];
  return <div>{data && activeSearchProvider.getNavComponent(queryData, data, fetchData)}</div>;
};

SearchNavigation.propTypes = {
  queryData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  searchState: PropTypes.object,
  activeSearchProvider: PropTypes.object,
};

export default SearchNavigation;
