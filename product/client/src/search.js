export const ZERO_HITS = 'zero hits';
export const CONTENT_ONLY = 'content only';

const executeProductSearch = queryData => {
  if (['', ZERO_HITS, CONTENT_ONLY].some(value => value === queryData.query)) {
    return new Promise(resolve => {
      resolve({
        count: 0,
        suggestions: ['suggestion 1', 'suggestion 2'],
        results: [],
      });
    });
  }
  return new Promise(resolve => {
    resolve({
      count: 5,
      results: [
        { id: '1', name: queryData.query + ' product 1' },
        { id: '2', name: queryData.query + ' product 2' },
        { id: '3', name: queryData.query + ' product 3' },
        { id: '4', name: queryData.query + ' product 4' },
        { id: '5', name: queryData.query + ' product 5' },
      ],
    });
  });
};

const executeProductCount = queryData => {
  if (queryData.query === ZERO_HITS || queryData.query === CONTENT_ONLY) {
    return new Promise(resolve => {
      resolve({
        count: 0,
      });
    });
  }
  return new Promise(resolve => {
    resolve({
      count: 5,
    });
  });
};

export { executeProductSearch, executeProductCount };
