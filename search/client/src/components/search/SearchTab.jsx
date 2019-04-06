import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

const SearchTab = props => {
  const { searchProviderId, children, onClick, isActive } = props;
  return (
    <Button
      style={{ margin: '5px' }}
      type="submit"
      key={searchProviderId}
      data-dmattributes={isActive ? 'active' : ''}
      data-dmid={`search-tab-${searchProviderId}`}
      onClick={event => onClick(event)}>
      {children}
    </Button>
  );
};

SearchTab.propTypes = {
  searchProviderId: PropTypes.string,
  children: PropTypes.object,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

export default SearchTab;
