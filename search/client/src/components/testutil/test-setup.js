import Enzyme from 'enzyme'; // eslint-disable-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16'; // eslint-disable-line import/no-extraneous-dependencies
import { ReducerRegistry } from '@dm/redux-store-provider'; // eslint-disable-line import/no-extraneous-dependencies
import { createI18next } from '@dm/i18n';
import initI18next from '../i18next/initI18next';

global.i18next = createI18next();

initI18next();

Enzyme.configure({ adapter: new Adapter() });

global.reducerRegistry = new ReducerRegistry();

// quick fix to not stifle in warnings, remove after theme fix
const { warn } = console;
// eslint-disable-next-line no-console, func-names
console.warn = function() {
	// eslint-disable-next-line prefer-rest-params
	const message = arguments[0];
	if (message && typeof message === 'string') {
		if (message.indexOf('is deprecated.') !== -1) {
			return;
		}
	}
	// eslint-disable-next-line prefer-rest-params
	warn.apply(console, [...arguments]);
};
