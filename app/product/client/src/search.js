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
      count: 6,
      results: [
        {
          id: '1',
          name: queryData.query + ' product 1',
          price: '3,95 €',
          image: 'http://localhost:3011/assets/product1.jpg',
        },
        {
          id: '2',
          name: queryData.query + ' product 2',
          price: '1,99 €',
          image: 'http://localhost:3011/assets/product2.jpg',
        },
        {
          id: '3',
          name: queryData.query + ' product 3',
          price: '8,65 €',
          image: 'http://localhost:3011/assets/product3.jpg',
        },
        {
          id: '4',
          name: queryData.query + ' product 4',
          price: '2,95 €',
          image: 'http://localhost:3011/assets/product4.jpg',
        },
        {
          id: '5',
          name: queryData.query + ' product 5',
          price: '8,65 €',
          image: 'http://localhost:3011/assets/product3.jpg',
        },
        {
          id: '6',
          name: queryData.query + ' product 6',
          price: '2,95 €',
          image: 'http://localhost:3011/assets/product4.jpg',
        },
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
      count: 6,
    });
  });
};

export { executeProductSearch, executeProductCount };
