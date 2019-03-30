import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'react-i18next';
import { compose } from 'recompose';
import { withStyle, connect } from '@dm/style-provider';

const setMMBehaviourVariables = () => {
	if (typeof window.mmBehaviourUtils !== 'undefined') {
		const productOverviewNavigationSummary = {};
		productOverviewNavigationSummary.currentPage = 0;
		productOverviewNavigationSummary.productsOnPage = 0;

		window.mmBehaviourUtils.updateVariable(
			'productOverviewNavigation',
			productOverviewNavigationSummary
		);
	}
};

const SearchError = props => {
	setMMBehaviourVariables();
	return (
		<div data-dmid="search-error-wrapper" className={props.styles.searchErrorWrapper}>
			<h1 data-dmid="search-error" className={props.styles.searchError}>
				{props.t('search.error.headline')}
			</h1>
		</div>
	);
};

const searchErrorWrapper = ({ theme }) => ({
	paddingTop: theme.dimension.spacing.xxxl.rem
});

const searchError = ({ theme }) => ({
	fontFamily: theme.typography.fontFamily.primary.medium,
	fontSize: theme.typography.fontSize.xxl.rem,
	color: theme.palette.color2.hex,
	textAlign: 'center',
	margin: `${theme.dimension.spacing.m.rem} 0`
});

SearchError.propTypes = {
	styles: PropTypes.object,
	t: PropTypes.func
};

export default compose(withStyle, connect({ searchError, searchErrorWrapper }), withI18n())(
	SearchError
);
