import React from 'react';
import { Provider } from 'react-redux';
import { createSnapshot, createMockStore } from '@dm/jest-utils';
import { mount, shallow } from 'enzyme';
import axios from 'axios';
import ContextWrapper, { ContextWrapperWithStore } from '../../testutil/ContextWrapper';
import * as actions from '../redux/actions';
import { reducerNameSearch } from '../redux/reducers';

import {
	initialize as initializeTestSearch,
	shutdown as shutDownTestProvider,
	testProvider
} from '../../testutil/searchContainer/TestSearchInitializer';
import initializeTestContentProvider from '../../testutil/searchContainer/TestContentProviderInitializer';
import { searchResults as results } from '../../testutil/searchContainer/actions';

import SearchContainer, { UnconnectedSearchContainer } from '../SearchContainer';

const getProps = query => ({
	locale: 'de',
	site: 'de_mcr',
	targetSystem: '',
	servicesGatewayUrl: 'https://services-stage.dm-drogeriemarkt.com',
	query: query || 'bio',
	searchType: 'product',
	parametersProductSearch: {
		categoryId: '',
		initialQuery: '',
		productQuery: '',
		hiddenFacets: '',
		currentPage: 1,
		pageSize: 24,
		sort: 'relevance'
	}
});

const testProviderProduct = testProvider('PRODUCT', 1);
const testProviderContent = testProvider('CONTENT', 2);

const store = createMockStore({
	[reducerNameSearch]: {
		searchState: {
			CONTENT: { results },
			PRODUCT: { results }
		},
		errorState: {},
		activeSearchProvider: { testProviderProduct },
		searchType: 'product',
		queryData: { ...getProps }
	}
});

describe('SearchContainer', () => {
	beforeEach(() => {
		jest.spyOn(window.history, 'pushState').mockImplementation(() => {
			/* do nothing */
		});
		jest.spyOn(window, 'addEventListener').mockImplementation(() => {
			/* do nothing */
		});
		jest.spyOn(window, 'removeEventListener').mockImplementation(() => {
			/* do nothing */
		});
	});

	afterEach(() => {
		store.clearActions();
		jest.clearAllMocks();
	});

	it('renders and matches snapshot when results are avaibable', () => {
		initializeTestSearch(testProviderProduct);
		initializeTestSearch(testProviderContent);

		const props = setupDefaultSearchContainerProperties();

		const snapshot = createSnapshot(
			<ContextWrapper>
				<UnconnectedSearchContainer {...props} />
			</ContextWrapper>
		);

		expect(snapshot).toMatchSnapshot();
	});

	it('renders and matches snapshot when no results are found (search fallback)', () => {
		initializeTestSearch(testProviderProduct);
		shutDownTestProvider('CONTENT');
		initializeTestContentProvider();

		const snapshot = createSnapshot(
			<ContextWrapper>
				<UnconnectedSearchContainer
					queryData={getProps('2ß9358ß239648')}
					searchType="product"
					searchFallback={{
						textId1: 535460,
						textId2: 535470
					}}
					setLoadingState={() => {}}
					setDisplaySuggestions={() => {}}
					setActiveSearchProvider={() => {}}
					updateSearchData={() => {}}
					updateCountData={() => {}}
					updateSuggestions={() => {}}
					searchError={() => {}}
					searchCountError={() => {}}
					searchState={{
						PRODUCT: {
							count: 0,
							results: [],
							suggestions: []
						}
					}}
					activeSearchProvider={null}
					styles={{}}
				/>
			</ContextWrapper>
		);
		expect(snapshot).toMatchSnapshot();
	});

	it('mounts and checks if container elements are available', () => {
		store.clearActions();
		initializeTestSearch(testProviderProduct);
		initializeTestSearch(testProviderContent);
		const props = setupDefaultSearchContainerProperties();

		const component = mount(
			<ContextWrapperWithStore store={store}>
				<ContextWrapper>
					<UnconnectedSearchContainer {...props} />
				</ContextWrapper>
			</ContextWrapperWithStore>
		);

		expect(component.find('[data-dmid="search-container"]')).toHaveLength(1);
		expect(component.find('[data-dmid="search-header"]')).toHaveLength(1);
		expect(component.find('[data-dmid="search-nav"]')).toHaveLength(1);
		expect(component.find('[data-dmid="search-tab-PRODUCT"]')).toHaveLength(1);
		expect(component.find('[data-dmid="search-tab-CONTENT"]')).toHaveLength(1);
		expect(component.find('[data-dmid="search-body"]')).toHaveLength(1);
	});

	it('mounts and updates search data (active search)', () => {
		initializeTestSearch(testProviderProduct);
		initializeTestSearch(testProviderContent);

		// expected update Search Data (active search provider)
		const expectedUpdateSearchData = {
			type: actions.UPDATE_SEARCH_DATA,
			ID: 'PRODUCT',
			activeSearchProvider: testProviderProduct,
			data: {
				searchResults: results
			},
			queryData: getProps()
		};

		axios.get = jest.fn().mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					reject(store.dispatch(expectedUpdateSearchData));
				})
		);

		function updateSearchData() {
			return new Promise(resolve => setImmediate(resolve(results)));
		}

		mount(
			<ContextWrapperWithStore store={store}>
				<SearchContainer
					queryData={getProps()}
					searchType="product"
					searchFallback={{
						textId1: 535460,
						textId2: 535470
					}}
				/>
			</ContextWrapperWithStore>
		);

		return updateSearchData().then(() => {
			expect(
				store.getActions().filter(action => action.type === actions.UPDATE_SEARCH_DATA)
			).toHaveLength(1);
			expect(
				store.getActions().filter(action => action.type === actions.UPDATE_SEARCH_DATA)[0]
			).toEqual(expectedUpdateSearchData);
		});
	});

	it('mounts and updates count data (inactive search tab)', () => {
		initializeTestSearch(testProviderProduct);
		initializeTestSearch(testProviderContent);

		// expected update Count Data (inactive search provider)
		const expectedUpdateCountData = {
			type: actions.UPDATE_COUNT_DATA,
			ID: 'CONTENT',
			data: {
				searchResults: results
			}
		};

		axios.get = jest.fn().mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					reject(store.dispatch(expectedUpdateCountData));
				})
		);

		function updateSearchData() {
			return new Promise(resolve => setImmediate(resolve(results)));
		}

		mount(
			<ContextWrapperWithStore store={store}>
				<SearchContainer
					queryData={getProps()}
					searchType="product"
					searchFallback={{
						textId1: 535460,
						textId2: 535470
					}}
				/>
			</ContextWrapperWithStore>
		);

		return updateSearchData().then(() => {
			expect(
				store.getActions().filter(action => action.type === actions.UPDATE_COUNT_DATA)
			).toHaveLength(1);
			expect(
				store.getActions().filter(action => action.type === actions.UPDATE_COUNT_DATA)[0]
			).toEqual(expectedUpdateCountData);
		});
	});

	it('registers history popstate handler on component mount', () => {
		const props = setupDefaultSearchContainerProperties();
		expect(window.addEventListener).not.toHaveBeenCalled();
		const wrapper = shallow(<UnconnectedSearchContainer {...props} />);
		expect(window.addEventListener).toHaveBeenCalledTimes(1);
		expect(window.addEventListener).toHaveBeenCalledWith(
			'popstate',
			wrapper.instance().handleHistoryPopState
		);
	});

	it('unsubscribes history popstate handler on component unmount', () => {
		const props = setupDefaultSearchContainerProperties();
		const wrapper = shallow(<UnconnectedSearchContainer {...props} />);
		expect(window.removeEventListener).not.toHaveBeenCalled();
		wrapper.instance().componentWillUnmount();
		expect(window.removeEventListener).toHaveBeenCalledTimes(1);
		expect(window.removeEventListener).toHaveBeenCalledWith(
			'popstate',
			wrapper.instance().handleHistoryPopState
		);
	});

	it('sets new active search provider when searchType is toggled', () => {
		const expectedSearchProvider = testProviderContent;

		const props = setupDefaultSearchContainerProperties();
		const wrapper = shallow(
			<UnconnectedSearchContainer {...props} activeSearchProvider={testProviderProduct} />
		);

		const popstateEvent = {
			state: {
				// type is lowercase whereas provider.ID is uppercase!
				type: expectedSearchProvider.ID.toLowerCase()
			}
		};
		wrapper.instance().handleHistoryPopState(popstateEvent);

		expect(props.setActiveSearchProvider).toHaveBeenCalledWith(expectedSearchProvider);
	});

	it('does not set active search provider when searchType is the same', () => {
		const popstateEvent = {
			state: {
				// type is lowercase whereas provider.ID is uppercase!
				type: testProviderProduct.ID.toLowerCase()
			}
		};
		ensureHistoryPopStateDoesNotChangeActiveSearchProvider(popstateEvent);
	});

	it('does not set active search provider when searchType undefined', () => {
		const popstateEvent = {
			state: {
				type: undefined
			}
		};
		ensureHistoryPopStateDoesNotChangeActiveSearchProvider(popstateEvent);
	});

	it('set default active search provider if history state is undefined', () => {
		const mockGetSearchProviders = jest.fn();
		jest.mock('search-api', () => ({ getSearchProviders: mockGetSearchProviders }));
		const props = setupDefaultSearchContainerProperties();
		shallow(<UnconnectedSearchContainer {...props} />);
		expect(props.setActiveSearchProvider).toHaveBeenCalledWith(testProviderProduct);
	});

	function ensureHistoryPopStateDoesNotChangeActiveSearchProvider(popstateEvent) {
		const props = setupDefaultSearchContainerProperties();
		// disableLifecycleMethods is needed to isolate handleHistoryPopState()
		const wrapper = shallow(
			<UnconnectedSearchContainer {...props} activeSearchProvider={testProviderProduct} />,
			{ disableLifecycleMethods: true }
		);
		wrapper.instance().handleHistoryPopState(popstateEvent);
		expect(props.setActiveSearchProvider).not.toHaveBeenCalled();
	}

	function setupDefaultSearchContainerProperties() {
		return {
			queryData: getProps(),
			queryState: {
				PRODUCT: getProps(),
				CONTENT: getProps()
			},
			searchType: 'product',
			searchFallback: {
				textId1: 535460,
				textId2: 535470
			},
			searchState: {
				CONTENT: { results },
				PRODUCT: { results }
			},
			activeSearchProvider: testProviderProduct,
			styles: {},
			setLoadingState: jest.fn(),
			setDisplaySuggestions: jest.fn(),
			setActiveSearchProvider: jest.fn(),
			updateSearchData: jest.fn(),
			updateCountData: jest.fn(),
			updateSuggestions: jest.fn(),
			searchError: jest.fn(),
			searchCountError: jest.fn()
		};
	}
});
