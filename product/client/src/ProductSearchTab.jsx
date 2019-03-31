import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import isEmpty from './util/isEmpty';

const ProductSearchTab = props => {
  const { data, t } = props;

  let count;
  if (data && !isEmpty(data)) {
    count = data ? data.count : '?';
  } else {
    count = '?';
  }

  return <span>{`${t('search.tab.products')} (${count})`}</span>;
};

ProductSearchTab.propTypes = {
  data: PropTypes.object,
  t: PropTypes.func,
};

export default withI18n()(ProductSearchTab);
