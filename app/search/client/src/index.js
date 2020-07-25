import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainerInternal from './components/SearchContainer';

SearchContainerInternal.render = function (selector, initialState) {
  document.addEventListener('DOMContentLoaded', function () {
    const props = {
      ...initialState,
    };
    ReactDOM.render(React.createElement(SearchContainer, props), document.querySelector(selector));
  });
};

export const SearchContainer = SearchContainerInternal;
export * from 'search-api';
