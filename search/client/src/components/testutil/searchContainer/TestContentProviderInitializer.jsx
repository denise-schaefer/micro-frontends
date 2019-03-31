import React from 'react';
import { registerContentProvider } from 'search-api';

const initializeTestContentProvider = () => {
  registerContentProvider({
    getContentComponent: contentId => <div>content component {contentId}</div>,
  });
};

export default initializeTestContentProvider;
