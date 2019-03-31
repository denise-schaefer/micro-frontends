import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';

const ProductSearchResult = props => {
  const { queryData, data, fetchData, t } = props;
  const { count, results } = data;

  return (
    <div>
      <p>{`${t('search.for', { query: decodeURIComponent(queryData.query) })}: ${count} counts`}</p>
      <div>
        {results.map(result => (
          <div key={result.gtin}>{result.name}</div>
        ))}
      </div>
      <br />
      <button type="button" onClick={() => fetchData({ query: 'tier', searchType: 'product' })}>
        {t('search.for', { query: decodeURIComponent('tier') })}
      </button>
    </div>
  );
};

ProductSearchResult.propTypes = {
  queryData: PropTypes.object,
  data: PropTypes.object,
  fetchData: PropTypes.func,
  t: PropTypes.func,
};

export default withI18n()(ProductSearchResult);
