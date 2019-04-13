import React from 'react';
import ReactDOM from 'react-dom';
import { provideGlobalStore } from '@dm/redux-store-provider';
import { compose } from 'recompose';
import SearchContainerInternal from './components/SearchContainer';

const SearchContainer = compose(provideGlobalStore)(SearchContainerInternal);

SearchContainer.render = function(selector, initialState) {
  document.addEventListener('DOMContentLoaded', function() {
    const props = {
      ...initialState,
    };
    ReactDOM.render(React.createElement(SearchContainer, props), document.querySelector(selector));
  });
};

export default SearchContainer;
