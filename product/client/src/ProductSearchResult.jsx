import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const ProductSearchResult = props => {
  const { queryData, data, fetchData } = props;
  const { count, results } = data;

  return (
    <Col>
      <Row className="justify-content-center">
        {`Suche nach "${decodeURIComponent(queryData.query)}": ${count} counts`}
      </Row>
      <div>
        <Row style={{ margin: '20px' }}>
          <DropdownButton id="dropdown-basic-button" title="Suche nach...">
            <Dropdown.Item onClick={() => fetchData({ query: 'tier', searchType: 'product' })}>
              {`Suche nach "${decodeURIComponent('tier')}"`}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => fetchData({ query: 'zero', searchType: 'product' })}>
              {`Suche nach "${decodeURIComponent('zero')}"`}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => fetchData({ query: 'content', searchType: 'product' })}>
              {`Suche nach "${decodeURIComponent('content')}"`}
            </Dropdown.Item>
          </DropdownButton>
          <div style={{ margin: '0 20px', maxWidth: '100%' }}>
            {results.map(result => (
              <div key={result.gtin}>{result.name}</div>
            ))}
          </div>
        </Row>
      </div>
    </Col>
  );
};

ProductSearchResult.propTypes = {
  queryData: PropTypes.object,
  data: PropTypes.object,
  fetchData: PropTypes.func,
};

export default ProductSearchResult;
