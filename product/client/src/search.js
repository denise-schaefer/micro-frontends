const executeProductSearch = queryData => {
  return new Promise(resolve => {
    resolve({
      count: 371,
      suggestions: ['suggestion 1', 'suggestion 2'],
      results: [
        { id: '1', name: 'item 1 ' + queryData.query },
        { id: '2', name: 'item 2 ' + queryData.query },
        { id: '3', name: 'item 3 ' + queryData.query },
      ],
    });
  });
};

const executeProductCount = queryData => {
  return new Promise(resolve => {
    resolve({
      count: 371,
    });
  });
};

const executeMockProductSearchZeroCounts = queryData => {
  return new Promise(resolve => {
    resolve({
      count: 0,
      suggestions: ['hello', 'world'],
      results: [],
    });
  });
};

const executeMockProductCountZeroCounts = queryData => {
  return new Promise(resolve => {
    resolve({
      count: 0,
    });
  });
};

export {
  executeProductSearch,
  executeProductCount,
  executeMockProductSearchZeroCounts,
  executeMockProductCountZeroCounts,
};
