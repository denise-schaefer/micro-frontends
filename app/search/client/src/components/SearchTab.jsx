import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

export default function SearchTab({ searchProviderId, children, onClick, isActive }) {
  return (
    <Button
      style={{ margin: '5px' }}
      variant="light"
      type="button"
      key={searchProviderId}
      active={isActive ? 'active' : ''}
      onClick={(event) => onClick(event)}>
      {children}
    </Button>
  );
}

SearchTab.propTypes = {
  searchProviderId: PropTypes.string,
  children: PropTypes.object,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};
