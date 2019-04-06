const executeContentSearch = () =>
  new Promise(resolve => {
    resolve({
      count: 42,
      results: ['a', 'b', 'c'],
      suggestions: ['bernd', 'das', 'brot'],
    });
  });

const executeContentCount = () =>
  new Promise(resolve => {
    resolve({
      count: 42,
    });
  });

const executeMockContentSearchZeroCounts = () =>
  new Promise(resolve => {
    resolve({
      count: 0,
      results: [],
      suggestions: ['bernd', 'das', 'brot'],
    });
  });

const executeMockContentCountZeroCounts = () =>
  new Promise(resolve => {
    resolve({
      count: 0,
    });
  });

export {
  executeContentCount,
  executeContentSearch,
  executeMockContentSearchZeroCounts,
  executeMockContentCountZeroCounts,
};
