import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchFallbackSuggestions from './SearchFallbackSuggestions';
import isEmpty from '../util/isEmpty';
import getObjectValues from '../util/getObjectValues';

class SearchFallback extends Component {
  getSuggestions = () => {
    const { searchState } = this.props;
    const suggestions = [];
    if (!isEmpty(searchState)) {
      getObjectValues(searchState).forEach(entry => {
        if (entry.suggestions && entry.suggestions.length > 0) {
          entry.suggestions.forEach(suggestion => suggestions.push(suggestion));
        }
      });
    }
    return suggestions;
  };

  render() {
    const suggestions = this.getSuggestions();

    const query = decodeURIComponent(this.props.query);

    return (
      <div>
        <h1>{`Keine Treffer für "${query}"`}</h1>
        {suggestions && suggestions.length > 0 && (
          <SearchFallbackSuggestions suggestions={suggestions} />
        )}
        <p>
          <h2>Suchtipps</h2>
          <div>
            Versuchen Sie, allgemeiner zu suchen - Sie können anschließend die Suchergebnisse
            filtern.
          </div>
        </p>
      </div>
    );
  }
}

SearchFallback.propTypes = {
  query: PropTypes.string,
  searchState: PropTypes.object,
};

export default SearchFallback;
