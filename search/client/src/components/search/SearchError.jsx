import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';

const setMMBehaviourVariables = () => {
  if (typeof window.mmBehaviourUtils !== 'undefined') {
    const productOverviewNavigationSummary = {};
    productOverviewNavigationSummary.currentPage = 0;
    productOverviewNavigationSummary.productsOnPage = 0;

    window.mmBehaviourUtils.updateVariable(
      'productOverviewNavigation',
      productOverviewNavigationSummary
    );
  }
};

const SearchError = props => {
  setMMBehaviourVariables();
  return (
    <div data-dmid="search-error-wrapper">
      <h1 data-dmid="search-error">{props.t('search.error.headline')}</h1>
    </div>
  );
};

SearchError.propTypes = {
  t: PropTypes.func,
};

export default withI18n()(SearchError);
