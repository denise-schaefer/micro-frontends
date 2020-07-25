import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export function SearchInput({ onSubmit, query = '' }) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ query: event.target.elements.query.value });
  }

  function handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <Form inline onSubmit={(event) => handleSubmit(event)}>
      <Form.Control
        type="search"
        name="query"
        placeholder="Search"
        value={value}
        onChange={(event) => handleChange(event)}
        className="mr-sm-2"
      />
      <Button variant="outline-success" type="submit">
        Search
      </Button>
    </Form>
  );
}

SearchInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  query: PropTypes.string,
};
