/* eslint-disable no-unused-vars */
import { provideI18n } from '@dm/i18n';
import { provideGlobalStore } from '@dm/redux-store-provider';
import { injectTheme } from '@dm/style-provider';
import { theme as dm } from '@dm/ui-theme';
import { withResponsive } from '@dm/device-provider';
import { compose } from 'recompose';
import SearchContainerInternal from './components/search/SearchContainer';

// message bundles
import dmInitI18next from './components/i18next/initI18next';

dmInitI18next();

export const SearchContainer = compose(
	injectTheme(dm),
	withResponsive,
	provideGlobalStore,
	provideI18n
)(SearchContainerInternal);
