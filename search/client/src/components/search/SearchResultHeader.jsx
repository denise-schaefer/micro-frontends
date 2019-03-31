import React from 'react';
import { connect } from '@dm/style-provider';
import { compose } from 'recompose';
import { getSearchProviders } from 'search-api';
import { withI18n } from 'react-i18next';
import PropTypes from 'prop-types';
import SearchTab from './SearchTab';
import isEmpty from '../../util/isEmpty';

const SearchResultHeader = props => {
  const { query, styles, activeSearchProvider, searchState, onTabClick, t } = props;

  const getTabFor = searchProvider => {
    const data = searchState[searchProvider.ID];
    if (!isEmpty(activeSearchProvider)) {
      return (
        <SearchTab
          key={searchProvider.ID}
          isActive={activeSearchProvider.ID === searchProvider.ID}
          searchProviderId={searchProvider.ID}
          onClick={() =>
            activeSearchProvider.ID !== searchProvider.ID && onTabClick(searchProvider)
          }>
          {searchProvider.getTabComponent(data)}
        </SearchTab>
      );
    }
    return null;
  };

  return (
    <div data-dmid="search-header" className={styles.searchHeader}>
      <h1 data-dmid="search-header-headline" className={styles.searchHeaderHeadline}>
        {t('search.for', { query: decodeURIComponent(query) })}
      </h1>
      <div data-dmid="search-tab-container" className={styles.searchTabContainer}>
        {getSearchProviders().map(provider => getTabFor(provider))}
      </div>
    </div>
  );
};

const searchHeader = ({ theme }) => ({
  display: 'flex',
  flexFlow: 'column nowrap',
  column2to6: {
    padding: `0 ${theme.dimension.spacing.xs.rem}`,
  },
});

const searchHeaderHeadline = ({ theme }) => ({
  fontFamily: theme.typography.fontFamily.primary.medium,
  fontSize: theme.typography.fontSize.xxxl.rem,
  color: theme.palette.color2.hex,
  textAlign: 'center',
  margin: `0 0 ${theme.dimension.spacing.s.rem} !important`,
});

const searchTabContainer = ({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.dimension.spacing.xl.rem,
});

SearchResultHeader.propTypes = {
  query: PropTypes.string,
  onTabClick: PropTypes.func,
  activeSearchProvider: PropTypes.object,
  searchState: PropTypes.object,
  styles: PropTypes.object,
  t: PropTypes.func,
};

export default compose(
  connect({ searchHeader, searchTabContainer, searchHeaderHeadline }),
  withI18n()
)(SearchResultHeader);
