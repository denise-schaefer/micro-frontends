import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainerInternal from './components/SearchContainer';

SearchContainerInternal.render = function (selector, initialState) {
  document.addEventListener('DOMContentLoaded', function () {
    const props = {
      ...initialState,
    };
    const container = document.querySelector(selector);
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(SearchContainer, props));
  });
};

export const SearchContainer = SearchContainerInternal;
export * from 'search-api';
