import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import SearchFallbackSuggestions from './SearchFallbackSuggestions';
import isEmpty from '../../util/isEmpty';
import getObjectValues from '../../util/getObjectValues';

class SearchFallback extends Component {
  componentDidUpdate() {
    this.props.handleUpdateSuggestions();
  }

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

  renderSearchFallback = () => {
    // TODO: i18next
    return (
      <div data-dmid="search-fallback-info-container-content">
        <h2>Suchtipps</h2>
        <div>
          Versuchen Sie, allgemeiner zu suchen - Sie können anschließend die Suchergebnisse filtern.
        </div>
      </div>
    );
  };

  render() {
    const { t } = this.props;
    const suggestions = this.getSuggestions();

    const query = decodeURIComponent(this.props.query);

    return (
      <div data-dmid="search-fallback-container">
        <h1 data-dmid="search-fallback-headline">{t('search.fallback.headline', { query })}</h1>
        {suggestions && suggestions.length > 0 && (
          <SearchFallbackSuggestions suggestions={suggestions} />
        )}
        <div data-dmid="search-fallback-info-container">{this.renderSearchFallback()}</div>
      </div>
    );
  }
}

SearchFallback.propTypes = {
  query: PropTypes.string,
  searchState: PropTypes.object,
  handleUpdateSuggestions: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default withI18n()(SearchFallback);
