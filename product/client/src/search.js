const executeProductSearch = queryData => {
  if (['', 'zero', 'content'].some(value => value === queryData.query)) {
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
      count: 371,
      results: [
        { id: '1', name: 'item 1 ' + queryData.query },
        { id: '2', name: 'item 2 ' + queryData.query },
        { id: '3', name: 'item 3 ' + queryData.query },
      ],
    });
  });
};

const executeProductCount = queryData => {
  if (queryData.query === 'zero' || queryData.query === 'content') {
    return new Promise(resolve => {
      resolve({
        count: 0,
      });
    });
  }
  return new Promise(resolve => {
    resolve({
      count: 371,
    });
  });
};

export { executeProductSearch, executeProductCount };
