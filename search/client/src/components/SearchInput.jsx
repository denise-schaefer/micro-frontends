import React from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/es/FormControl';
import Button from 'react-bootstrap/Button';

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit({ query: event.target.elements.query.value });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <Form inline onSubmit={event => this.handleSubmit(event)}>
        <FormControl
          type="search"
          name="query"
          placeholder="Search"
          value={this.state.value}
          onChange={event => this.handleChange(event)}
          className="mr-sm-2"
        />
        <Button variant="outline-success" type="submit">
          Search
        </Button>
      </Form>
    );
  }
}
