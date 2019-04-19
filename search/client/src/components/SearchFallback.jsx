import React from 'react';
import PropTypes from 'prop-types';
import SearchFallbackSuggestions from './SearchFallbackSuggestions';
import isEmpty from '../util/isEmpty';
import getObjectValues from '../util/getObjectValues';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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
    <Col>
      <Row className="justify-content-center">
        <h1>{`Keine Treffer für "${decodedQuery}"`}</h1>
      </Row>
      <Row className="justify-content-center">
        {suggestions && suggestions.length > 0 && (
          <SearchFallbackSuggestions suggestions={suggestions} />
        )}
      </Row>
      <Row className="justify-content-center">
        <h2>Suchtipps</h2>
      </Row>
      <Row className="justify-content-center">
        Versuchen Sie, allgemeiner zu suchen - Sie können anschließend die Suchergebnisse filtern.
      </Row>
    </Col>
  );
}

SearchFallback.propTypes = {
  query: PropTypes.string,
  searchState: PropTypes.object,
};
