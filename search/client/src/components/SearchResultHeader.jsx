import React from 'react';
import { getSearchProviders } from 'search-api';
import PropTypes from 'prop-types';
import SearchTab from './SearchTab';
import isEmpty from '../util/isEmpty';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function SearchResultHeader({
  query,
  activeSearchProvider,
  countState,
  onTabClick,
}) {
  const getTabFor = searchProvider => {
    const data = countState[searchProvider.ID];
    if (!isEmpty(activeSearchProvider)) {
      return (
        <SearchTab
          key={searchProvider.ID}
          isActive={activeSearchProvider.ID === searchProvider.ID}
          searchProviderId={searchProvider.ID}
          onClick={() =>
            activeSearchProvider.ID !== searchProvider.ID && onTabClick(searchProvider)
          }>
          {searchProvider.getTabComponent(data)}
        </SearchTab>
      );
    }
    return null;
  };

  return (
    <Col>
      <Row className="justify-content-center">
        <h1>{`Suche nach "${decodeURIComponent(query)}"`}</h1>
      </Row>
      <Row className="justify-content-center">
        {getSearchProviders().map(provider => getTabFor(provider))}
      </Row>
    </Col>
  );
}

SearchResultHeader.propTypes = {
  query: PropTypes.string,
  onTabClick: PropTypes.func,
  activeSearchProvider: PropTypes.object,
  countState: PropTypes.object,
};
