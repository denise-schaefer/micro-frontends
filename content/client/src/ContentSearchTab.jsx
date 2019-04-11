import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from './util/isEmpty';

const ContentSearchTab = props => {
  const { data } = props;

  let count;
  if (data && !isEmpty(data)) {
    count = data ? data.count : '?';
  } else {
    count = '?';
  }

  return <span>{`Beratung (${count})`}</span>;
};

ContentSearchTab.propTypes = {
  data: PropTypes.object,
};

export default ContentSearchTab;
