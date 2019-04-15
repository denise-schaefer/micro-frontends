import React from 'react';
import PropTypes from 'prop-types';
import SearchFallbackSuggestions from './SearchFallbackSuggestions';
import isEmpty from '../util/isEmpty';
import getObjectValues from '../util/getObjectValues';

export default function SearchFallback({ query, searchState }) {
  function getSuggestions() {
    const suggestions = [];
    if (!isEmpty(searchState)) {
      getObjectValues(searchState).forEach(entry => {
        if (entry.suggestions && entry.suggestions.length > 0) {
          entry.suggestions.forEach(suggestion => suggestions.push(suggestion));
        }
      });
    }
    return suggestions;
  }

  const suggestions = getSuggestions();
  const decodedQuery = decodeURIComponent(query);

  return (
    <div>
      <h1>{`Keine Treffer für "${decodedQuery}"`}</h1>
      {suggestions && suggestions.length > 0 && (
        <SearchFallbackSuggestions suggestions={suggestions} />
      )}
      <p>
        <h2>Suchtipps</h2>
        <div>
          Versuchen Sie, allgemeiner zu suchen - Sie können anschließend die Suchergebnisse filtern.
        </div>
      </p>
    </div>
  );
}

SearchFallback.propTypes = {
  query: PropTypes.string,
  searchState: PropTypes.object,
};
