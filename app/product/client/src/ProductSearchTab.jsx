import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from './util/isEmpty';

const ProductSearchTab = props => {
  const { data } = props;

  let count;
  if (data && !isEmpty(data)) {
    count = data ? data.count : '?';
  } else {
    count = '?';
  }

  return <span>{`Produkte (${count})`}</span>;
};

ProductSearchTab.propTypes = {
  data: PropTypes.object,
};

export default ProductSearchTab;
