import React from 'react';

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
			<form onSubmit={event => this.handleSubmit(event)}>
				<input type="search" name="query" value={this.state.value} onChange={event => this.handleChange(event)} />
				<button type="submit">find</button>
			</form>
		);
	}
}
