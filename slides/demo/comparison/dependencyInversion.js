registry.registerSearchProvider({
	ID: 'product',
	order: 1,
	execute_search: query => executeProductSearch(query),
	getTabComponent: data => <ProductTab data={data} />,
	getResultComponent: (query, data) => (
		<ProductResult query={query} data={data} />
	),
});

// -------       ↑ Product ↑    ----------
// --- loosely coupled micro-frontends ---
// -------       ↓ Search ↓     ----------

const searchProviders = registry.getSearchProviders()
<SearchContainer>
	<div id=“search-tabs>
		{searchProviders.map(provider => getTabFor(provider))}}
	</div>
	{activeProvider.getResultComponent(query, data)}
</SearchContainer>
