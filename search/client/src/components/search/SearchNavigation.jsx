import React from 'react';
import { connect as connectFela } from '@dm/style-provider';
import PropTypes from 'prop-types';
import isEmpty from '../../util/isEmpty';

const SearchNavigation = props => {
  const { activeSearchProvider, queryData, searchState, fetchData, styles } = props;

  const getNavFor = searchProvider => {
    const data = !isEmpty(searchProvider) ? searchState[searchProvider.ID] : undefined;

    if (!isEmpty(activeSearchProvider)) {
      return (
        <div data-dmid="search-nav" className={styles.searchNav}>
          {searchProvider.getNavComponent(queryData, data, fetchData)}
        </div>
      );
    }
    return null;
  };
  return getNavFor(activeSearchProvider);
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
