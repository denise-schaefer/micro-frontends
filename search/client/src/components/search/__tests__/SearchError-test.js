import React from 'react';
import { createSnapshot } from '@dm/jest-utils';
import ContextWrapper from '../../testutil/ContextWrapper';

import SearchError from '../SearchError';

describe('SearchError', () => {
  it('renders and matches snapshot (DE)', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="de">
        <SearchError />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('renders and matches snapshot (HU)', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="hu">
        <SearchError />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
