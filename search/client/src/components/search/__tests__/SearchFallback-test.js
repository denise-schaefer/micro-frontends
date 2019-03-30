import React from 'react';
import { createSnapshot } from '@dm/jest-utils';
import ContextWrapper from '../../testutil/ContextWrapper';
import SearchFallback from '../SearchFallback';
import initializeTestContentProvider from '../../testutil/searchContainer/TestContentProviderInitializer';

describe('SearchFallback', () => {
  beforeAll(() => {
    initializeTestContentProvider();
  });

  it('renders and matches snapshot (DE)', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="de">
        <SearchFallback
          query="2ß9358ß239648"
          searchFallback={{
            textId1: 535460,
            textId2: 535470,
          }}
          searchState={{ PRODUCT: { count: 0, suggestions: ['hello', 'world'], results: [] } }}
          handleUpdateSuggestions={() => {}}
        />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('renders and matches snapshot (HU)', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="hu">
        <SearchFallback
          query="2ß9358ß239648"
          searchFallback={{
            textId1: 535460,
            textId2: 535470,
          }}
          handleUpdateSuggestions={() => {}}
        />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
