import React from 'react';
import { connect } from '@dm/style-provider';
import PropTypes from 'prop-types';

const SearchTab = props => {
	const { searchProviderId, children, onClick, styles, isActive } = props;
	return (
		<button
			type="submit"
			key={searchProviderId}
			data-dmattributes={isActive ? 'active' : ''}
			data-dmid={`search-tab-${searchProviderId}`}
			className={styles.searchTab}
			onClick={event => onClick(event)}>
			{children}
		</button>
	);
};

const searchTab = ({ theme, isActive }) => ({
	backgroundColor: isActive ? theme.palette.color2.hex : theme.palette.color4.hex,
	height: '2.5rem',
	lineHeight: '2.7em',
	color: isActive ? theme.palette.color5.hex : theme.palette.color2.hex,
	border: 0,
	cursor: 'pointer',
	position: 'relative',
	zIndex: 1,
	margin: theme.dimension.spacing.xxxs.rem,
	borderRadius: theme.dimension.spacing.m.rem,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: theme.typography.fontSize.m.rem,
	fontFamily: theme.typography.fontFamily.primary.medium,
	padding: `0 ${theme.dimension.spacing.xs.rem}`,
	'&:focus': {
		outline: 'none'
	},
	'&:after': {
		boxSizing: 'border-box',
		display: isActive ? 'block' : 'none',
		content: '" "',
		position: 'absolute',
		width: '1em',
		height: '1em',
		border: `2px solid ${theme.palette.color2.hex}`,
		zIndex: 1,
		backgroundColor: theme.palette.color2.hex,
		top: '2em',
		marginLeft: '-6px',
		left: '50%',
		transform: 'rotate(45deg)'
	}
});

SearchTab.propTypes = {
	searchProviderId: PropTypes.string,
	children: PropTypes.object,
	onClick: PropTypes.func,
	styles: PropTypes.object,
	isActive: PropTypes.bool
};

export default connect({ searchTab })(SearchTab);
