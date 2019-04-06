import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';

const ContentSearchResult = props => {
  const { queryData, data, t } = props;
  const { count, results } = data;

  return (
    <div>
      <p>{`${t('search.for', {
        query: decodeURIComponent(queryData.query),
      })}: ${count} counts`}</p>
      <p>{results}</p>
    </div>
  );
};

ContentSearchResult.propTypes = {
  queryData: PropTypes.object,
  data: PropTypes.object,
  t: PropTypes.func,
};

export default withI18n()(ContentSearchResult);
