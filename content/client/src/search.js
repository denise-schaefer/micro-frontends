const executeContentSearch = queryData => {
  if (queryData.query === 'zero') {
    return new Promise(resolve => {
      resolve({
        count: 0,
        results: [],
        suggestions: ['bernd', 'das', 'brot'],
      });
    });
  }
  return new Promise(resolve => {
    resolve({
      count: 42,
      results: ['a', 'b', 'c'],
    });
  });
};

const executeContentCount = queryData => {
  if (queryData.query === 'zero') {
    return new Promise(resolve => {
      resolve({
        count: 0,
      });
    });
  }
  return new Promise(resolve => {
    resolve({
      count: 42,
    });
  });
};

export { executeContentCount, executeContentSearch };
