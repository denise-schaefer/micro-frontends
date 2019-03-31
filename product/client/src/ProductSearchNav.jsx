import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';

const ProductSearchNav = props => {
  const { fetchData, t } = props;

  return (
    <div style={{ border: '2px solid #efefef', width: '13.75em' }}>
      <button type="button" onClick={() => fetchData({ query: 'tier', searchType: 'product' })}>
        {t('search.for', { query: decodeURIComponent('tier') })}
      </button>
    </div>
  );
};

ProductSearchNav.propTypes = {
  fetchData: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default withI18n()(ProductSearchNav);
