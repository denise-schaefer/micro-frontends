const searchResults = {
  count: 42,
  suggestions: ['suggestion 1', 'suggestion 2', 'suggestion 3'],
  results: ['result 1', 'result 2', 'result 3'],
};

const executeProductSearch = () => {
  const results = {
    searchResults,
  };
  return new Promise(resolve => resolve(results));
};

const executeProductCount = () => {
  const results = {
    searchResults,
  };
  return new Promise(resolve => resolve(results));
};

export { executeProductSearch, executeProductCount, searchResults };
