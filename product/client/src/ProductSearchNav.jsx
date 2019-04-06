import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

const ProductSearchNav = props => {
  const { fetchData, t } = props;

  return (
    <DropdownButton id="dropdown-basic-button" title="Filter">
      <Dropdown.Item onClick={() => fetchData({ query: 'tier', searchType: 'product' })}>
        {t('search.for', { query: decodeURIComponent('tier') })}
      </Dropdown.Item>
    </DropdownButton>
  );
};

ProductSearchNav.propTypes = {
  fetchData: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default withI18n()(ProductSearchNav);
