export const ZERO_HITS = 'zero hits';

// dummy search data
const executeContentSearch = (queryData) => {
  if (['', ZERO_HITS].some((value) => value === queryData.query)) {
    return new Promise((resolve) => {
      resolve({
        count: 0,
        results: [],
        suggestions: ['bernd', 'das', 'brot'],
      });
    });
  }
  if (['payback'].some((value) => value === queryData.query)) {
    return new Promise((resolve) => {
      resolve({
        count: 3,
        results: [
          {
            id: '1',
            name: queryData.query,
            image: 'http://localhost:3012/assets/blue.png',
          },
        ],
      });
    });
  }
  return new Promise((resolve) => {
    resolve({
      count: 3,
      results: [
        {
          id: '1',
          name: queryData.query + ' Foto',
          image: 'http://localhost:3012/assets/foto.jpg',
        },
        {
          id: '2',
          name: queryData.query + ' dm Marke',
          image: 'http://localhost:3012/assets/dmmarke.jpg',
        },
        {
          id: '3',
          name: queryData.query + ' Pflege',
          image: 'http://localhost:3012/assets/pflege.jpg',
        },
      ],
    });
  });
};

const executeContentCount = (queryData) => {
  if (queryData.query === ZERO_HITS) {
    return new Promise((resolve) => {
      resolve({
        count: 0,
      });
    });
  }
  return new Promise((resolve) => {
    resolve({
      count: 3,
    });
  });
};

export { executeContentCount, executeContentSearch };
