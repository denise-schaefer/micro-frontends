import React from 'react';
import ReactDOM from 'react-dom';
import { provideI18n } from '@dm/i18n';
import { provideGlobalStore } from '@dm/redux-store-provider';
import { compose } from 'recompose';
import SearchContainerInternal from './components/search/SearchContainer';

// message bundles
import dmInitI18next from './components/i18next/initI18next';

dmInitI18next();

const SearchContainer = compose(
  provideGlobalStore,
  provideI18n
)(SearchContainerInternal);

SearchContainer.render = function(selector, initialState) {
  document.addEventListener('DOMContentLoaded', function() {
    const props = {
      ...initialState,
    };
    ReactDOM.render(React.createElement(SearchContainer, props), document.querySelector(selector));
  });
};

export default SearchContainer;
