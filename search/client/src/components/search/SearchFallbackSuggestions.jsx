import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { withI18n } from 'react-i18next';

const removeDuplicatesFromArray = suggestions =>
  suggestions.reduce((prev, curr) => {
    if (prev.indexOf(curr) < 0) {
      prev.push(curr);
    }
    return prev;
  }, []);

const getSuggestionLinks = suggestions =>
  removeDuplicatesFromArray(suggestions)
    .map(suggestion => {
      const queryParams = qs.parse(window.location.search);
      queryParams.q = suggestion;
      return (
        <a
          title={suggestion}
          key={suggestion}
          data-dmid="suggestion-link"
          href={decodeURIComponent(qs.stringify(queryParams))}>
          {suggestion}
        </a>
      );
    })
    .reduce((prev, curr) => [prev, ', ', curr]);

const SearchFallbackSuggestions = props => {
  const { suggestions, styles, t } = props;

  return (
    !(suggestions.length <= 0) && (
      <div data-dmid="search-fallback-suggestions" className={styles.suggestions}>
        {t('suggestions.label')} {getSuggestionLinks(suggestions)}?
      </div>
    )
  );
};

SearchFallbackSuggestions.propTypes = {
  suggestions: PropTypes.array,
  t: PropTypes.func,
};

export default withI18n()(SearchFallbackSuggestions);
