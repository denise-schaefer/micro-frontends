import React from 'react';
import PropTypes from 'prop-types';
import { StyleProvider } from '@dm/style-provider';
import { DeviceProvider } from '@dm/device-provider';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { theme as dm } from '@dm/ui-theme';

export default function ContextWrapper({ children, locale }) {
	return (
		<StyleProvider>
			<DeviceProvider>
				<I18nextProvider i18n={global.i18next} initialLanguage={locale}>
					{children}
				</I18nextProvider>
			</DeviceProvider>
		</StyleProvider>
	);
}

ContextWrapper.propTypes = {
	children: PropTypes.node,
	locale: PropTypes.string
};

export function ContextWrapperWithoutResponsive({ children, locale }) {
	return (
		<StyleProvider>
			<I18nextProvider i18n={global.i18next} initialLanguage={locale}>
				{children}
			</I18nextProvider>
		</StyleProvider>
	);
}

ContextWrapperWithoutResponsive.propTypes = {
	children: PropTypes.node,
	locale: PropTypes.string
};

export function ContextWrapperWithStore({ children, locale, theme = dm, store = global.store }) {
	return (
		<Provider store={store}>
			<StyleProvider theme={theme}>
				<I18nextProvider i18n={global.i18next} initialLanguage={locale}>
					{children}
				</I18nextProvider>
			</StyleProvider>
		</Provider>
	);
}

ContextWrapperWithStore.propTypes = {
	children: PropTypes.node,
	locale: PropTypes.string,
	store: PropTypes.object,
	theme: PropTypes.object
};
