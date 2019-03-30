describe('search registry', () => {
	describe('getSearchProviders', () => {
		it('throw error when there are no registered providers', () => {
			const { getSearchProviders } = initRegistryTestCase();
			expect(() => getSearchProviders()).toThrow('No SearchProvider registered!');
		});

		it('returns registered searchProviders sorted by ORDER', () => {
			const { registerSearchProvider, getSearchProviders } = initRegistryTestCase();

			const firstProvider = {
				ID: 'first',
				order: 1
			};

			const secondProvider = {
				ID: 'second',
				order: 2
			};

			registerSearchProvider(secondProvider);
			expect(getSearchProviders()).toEqual([secondProvider]);

			registerSearchProvider(firstProvider);
			expect(getSearchProviders()).toEqual([firstProvider, secondProvider]);
		});
	});

	function initRegistryTestCase() {
		// registry has local state
		// so we have to reset everything
		// to avoid test side effects
		jest.resetModules();

		// eslint-disable-next-line global-require
		return require('../registry');
	}
});
