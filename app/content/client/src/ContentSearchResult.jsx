import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import { ZERO_HITS } from './search';

const ContentSearchResult = props => {
  const { queryData, data, fetchData } = props;
  const { count, results } = data;

  return (
    <Col>
      <Row className="justify-content-center">
        {`Suche nach "${decodeURIComponent(queryData.query)}": ${count} counts`}
      </Row>
      <div>
        <Col>
          <div style={{ maxWidth: '100%' }}>
            {results.map(result => (
              <Card key={result.gtin} style={{ margin: '10px' }}>
                <Card.Body>
                  <Card.Title>{result.name}</Card.Title>
                  <Card.Subtitle>Lorem ipsum</Card.Subtitle>
                </Card.Body>
                <img width="100%" height="150px" src={result.image} alt={result.name} />
                <Card.Body>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                    tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At
                    vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
          <DropdownButton
            id="dropdown-basic-button"
            variant="light"
            title="Suche nach..."
            style={{ margin: '10px' }}>
            <Dropdown.Item onClick={() => fetchData({ query: 'tier', searchType: 'product' })}>
              {`Suche nach "${decodeURIComponent('tier')}"`}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => fetchData({ query: 'content only', searchType: 'product' })}>
              {`Suche nach "${decodeURIComponent('content only')}"`}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => fetchData({ query: ZERO_HITS, searchType: 'product' })}>
              {`Suche nach "${decodeURIComponent(ZERO_HITS)}"`}
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </div>
    </Col>
  );
};

ContentSearchResult.propTypes = {
  queryData: PropTypes.object,
  data: PropTypes.object,
  fetchData: PropTypes.func,
};

export default ContentSearchResult;
