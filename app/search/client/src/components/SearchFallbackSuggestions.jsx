import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';

const removeDuplicatesFromArray = (suggestions) =>
  suggestions.reduce((prev, curr) => {
    if (prev.indexOf(curr) < 0) {
      prev.push(curr);
    }
    return prev;
  }, []);

const getSuggestionLinks = (suggestions) =>
  removeDuplicatesFromArray(suggestions)
    .map((suggestion) => {
      const queryParams = {
        query: suggestion,
      };
      return (
        <a
          title={suggestion}
          key={suggestion}
          href={decodeURIComponent(`?${qs.stringify(queryParams)}`)}>
          {suggestion}
        </a>
      );
    })
    .reduce((prev, curr) => [prev, ', ', curr]);

export default function SearchFallbackSuggestions({ suggestions }) {
  return (
    !(suggestions.length <= 0) && (
      <div>
        {'Meinten Sie '}
        <span>{getSuggestionLinks(suggestions)}</span>
        {'?'}
      </div>
    )
  );
}

SearchFallbackSuggestions.propTypes = {
  suggestions: PropTypes.array,
};
