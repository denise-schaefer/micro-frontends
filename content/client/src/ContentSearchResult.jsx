import React from 'react';
import PropTypes from 'prop-types';

const ContentSearchResult = props => {
  const { queryData, data } = props;
  const { count, results } = data;

  return (
    <div>
      <p>{`Suche nach "${decodeURIComponent(queryData.query)}": ${count} counts`}</p>
      <p>{results}</p>
    </div>
  );
};

ContentSearchResult.propTypes = {
  queryData: PropTypes.object,
  data: PropTypes.object,
};

export default ContentSearchResult;
