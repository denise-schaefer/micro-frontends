export const ZERO_HITS = 'zero hits';

const executeContentSearch = queryData => {
  if (['', ZERO_HITS].some(value => value === queryData.query)) {
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
      count: 3,
      results: [
        { id: '1', name: queryData.query + ' content 1' },
        { id: '2', name: queryData.query + ' content 2' },
        { id: '3', name: queryData.query + ' content 3' },
      ],
    });
  });
};

const executeContentCount = queryData => {
  if (queryData.query === ZERO_HITS) {
    return new Promise(resolve => {
      resolve({
        count: 0,
      });
    });
  }
  return new Promise(resolve => {
    resolve({
      count: 3,
    });
  });
};

export { executeContentCount, executeContentSearch };
