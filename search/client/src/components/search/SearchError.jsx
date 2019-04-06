import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';

const SearchError = props => {
  return <p>{props.t('search.error.headline')}</p>;
};

SearchError.propTypes = {
  t: PropTypes.func,
};

export default withI18n()(SearchError);
