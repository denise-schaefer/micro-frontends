import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './components/SearchContainer';

SearchContainer.render = function(selector, initialState) {
  document.addEventListener('DOMContentLoaded', function() {
    const props = {
      ...initialState,
    };
    ReactDOM.render(React.createElement(SearchContainer, props), document.querySelector(selector));
  });
};

export default SearchContainer;
