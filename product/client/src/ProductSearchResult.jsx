import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const ProductSearchResult = props => {
  const { queryData, data, fetchData, t } = props;
  const { count, results } = data;

  return (
    <div>
      <p>{`${t('search.for', { query: decodeURIComponent(queryData.query) })}: ${count} counts`}</p>
      <div style={{ margin: '20px' }}>
        {results.map(result => (
          <div key={result.gtin}>{result.name}</div>
        ))}
      </div>
      <DropdownButton id="dropdown-basic-button" title="Filter">
        <Dropdown.Item onClick={() => fetchData({ query: 'tier', searchType: 'product' })}>
          {t('search.for', { query: decodeURIComponent('tier') })}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => fetchData({ query: 'zero', searchType: 'product' })}>
          {t('search.for', { query: decodeURIComponent('zero') })}
        </Dropdown.Item>
        <Dropdown.Item onClick={() => fetchData({ query: 'content', searchType: 'product' })}>
          {t('search.for', { query: decodeURIComponent('content') })}
        </Dropdown.Item>
      </DropdownButton>
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
