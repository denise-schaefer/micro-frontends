import React from 'react';
import { connect as connectFela } from '@dm/style-provider';
import PropTypes from 'prop-types';
import isEmpty from '../../util/isEmpty';

const SearchNavigation = props => {
  const { activeSearchProvider, queryData, searchState, fetchData, styles } = props;

  if (isEmpty(activeSearchProvider)) {
    return null;
  }

  const data = searchState[activeSearchProvider.ID];
  return (
    <div data-dmid="search-nav" className={styles.searchNav}>
      {data && activeSearchProvider.getNavComponent(queryData, data, fetchData)}
    </div>
  );
};

const searchNav = ({ theme }) => ({
  width: '13.75em',
  padding: `0 ${theme.dimension.spacing.xxl.rem} 0 0`,
  display: 'block',
  column2to6: {
    display: 'none',
    width: 0,
    padding: 0,
  },
});

SearchNavigation.propTypes = {
  queryData: PropTypes.object,
  fetchData: PropTypes.func.isRequired,
  searchState: PropTypes.object,
  activeSearchProvider: PropTypes.object,
  styles: PropTypes.object,
};

export default connectFela({ searchNav })(SearchNavigation);
