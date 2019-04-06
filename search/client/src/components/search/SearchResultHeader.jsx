import React from 'react';
import { getSearchProviders } from 'search-api';
import { withI18n } from 'react-i18next';
import PropTypes from 'prop-types';
import SearchTab from './SearchTab';
import isEmpty from '../../util/isEmpty';

const SearchResultHeader = props => {
  const { query, activeSearchProvider, countState, onTabClick, t } = props;

  const getTabFor = searchProvider => {
    const data = countState[searchProvider.ID];
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
    <div>
      <h1>{t('search.for', { query: decodeURIComponent(query) })}</h1>
      <p>{getSearchProviders().map(provider => getTabFor(provider))}</p>
    </div>
  );
};

SearchResultHeader.propTypes = {
  query: PropTypes.string,
  onTabClick: PropTypes.func,
  activeSearchProvider: PropTypes.object,
  countState: PropTypes.object,
  t: PropTypes.func,
};

export default withI18n()(SearchResultHeader);
