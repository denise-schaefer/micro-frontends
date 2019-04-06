import React from 'react';
import PropTypes from 'prop-types';

const SearchTab = props => {
  const { searchProviderId, children, onClick, isActive } = props;
  return (
    <button
      type="submit"
      key={searchProviderId}
      data-dmattributes={isActive ? 'active' : ''}
      data-dmid={`search-tab-${searchProviderId}`}
      onClick={event => onClick(event)}>
      {children}
    </button>
  );
};

SearchTab.propTypes = {
  searchProviderId: PropTypes.string,
  children: PropTypes.object,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

export default SearchTab;
