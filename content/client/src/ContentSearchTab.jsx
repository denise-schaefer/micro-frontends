import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import isEmpty from './util/isEmpty';

const ContentSearchTab = props => {
  const { data } = props;

  let count;
  if (data && !isEmpty(data)) {
    count = data ? data.count : '?';
  } else {
    count = '?';
  }

  return <span>{`${props.t('search.tab.content')} (${count})`}</span>;
};

ContentSearchTab.propTypes = {
  data: PropTypes.object,
  t: PropTypes.func,
};

export default withI18n()(ContentSearchTab);
