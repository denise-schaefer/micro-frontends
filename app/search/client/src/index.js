import React from 'react';
import { createRoot } from 'react-dom/client';
import SearchContainerInternal from './components/SearchContainer';

SearchContainerInternal.render = function (selector, initialState) {
  document.addEventListener('DOMContentLoaded', function () {
    const props = {
      ...initialState,
    };
    const container = document.querySelector(selector);
    const root = createRoot(container);
    root.render(React.createElement(SearchContainer, props));
  });
};

export const SearchContainer = SearchContainerInternal;
export * from 'search-api';
