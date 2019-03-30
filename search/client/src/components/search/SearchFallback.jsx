import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import { connect } from '@dm/style-provider';
import { compose } from 'recompose';
import { getContentProvider } from 'search-api';
import SearchFallbackSuggestions from './SearchFallbackSuggestions';
import isEmpty from '../../util/isEmpty';
import getObjectValues from '../../util/getObjectValues';

class SearchFallback extends Component {
	componentDidUpdate() {
		this.props.handleUpdateSuggestions();
	}

	getSuggestions = () => {
		const { searchState } = this.props;
		const suggestions = [];
		if (!isEmpty(searchState)) {
			getObjectValues(searchState).forEach(entry => {
				if (entry.suggestions && entry.suggestions.length > 0) {
					entry.suggestions.forEach(suggestion => suggestions.push(suggestion));
				}
			});
		}
		return suggestions;
	};

	renderSearchFallback = () => {
		const { searchFallback, basicConfig, styles } = this.props;

		if (!searchFallback) {
			return null;
		}

		return getObjectValues(searchFallback).map(contentId => (
			<div
				data-dmid="search-fallback-info-container-content"
				className={styles.infoContainerContent}
				key={contentId}>
				{getContentProvider() && getContentProvider().getContentComponent(contentId, basicConfig)}
			</div>
		));
	};

	render() {
		const { styles, t } = this.props;
		const suggestions = this.getSuggestions();

		const query = decodeURIComponent(this.props.query);

		return (
			<div data-dmid="search-fallback-container" className={styles.searchFallbackContainer}>
				<h1 data-dmid="search-fallback-headline" className={styles.headline}>
					{t('search.fallback.headline', { query })}
				</h1>
				{suggestions &&
					suggestions.length > 0 && <SearchFallbackSuggestions suggestions={suggestions} />}
				<div data-dmid="search-fallback-info-container" className={styles.infoContainer}>
					{this.renderSearchFallback()}
				</div>
			</div>
		);
	}
}

const searchFallbackContainer = ({ theme }) => ({
	column2to6: {
		padding: `0 ${theme.dimension.spacing.xs.rem}`
	}
});

const headline = ({ theme }) => ({
	hyphens: 'auto',
	fontFamily: theme.typography.fontFamily.primary.medium,
	fontSize: theme.typography.fontSize.xxl.rem,
	color: theme.palette.color2.hex,
	textAlign: 'center',
	margin: `${theme.dimension.spacing.m.rem} 0 ${theme.dimension.spacing.xl.rem}`
});

const infoContainer = () => ({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'space-around',
	position: 'relative',
	marginTop: '0'
});

const infoContainerContent = () => ({
	flex: '0 0 auto',
	width: '30%',

	'&:first-of-type': {
		paddingRight: '2rem'
	},

	column2to6: {
		flex: '1 0 100%',

		'&:first-of-type': {
			paddingRight: 0
		}
	}
});

SearchFallback.propTypes = {
	query: PropTypes.string,
	searchState: PropTypes.object,
	searchFallback: PropTypes.object,
	basicConfig: PropTypes.object,
	handleUpdateSuggestions: PropTypes.func.isRequired,
	styles: PropTypes.object,
	t: PropTypes.func
};

export default compose(
	connect({ headline, infoContainer, infoContainerContent, searchFallbackContainer }),
	withI18n()
)(SearchFallback);
