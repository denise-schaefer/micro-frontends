import React from 'react';
import { createSnapshot } from '@dm/jest-utils';

import SearchTab from '../SearchTab';
import ContextWrapper from '../../testutil/ContextWrapper';

describe('SearchTab', () => {
  it('(active) renders and matches snapshot', () => {
    const snapshot = createSnapshot(
      <ContextWrapper>
        <SearchTab searchProviderId="TEST" isActive onClick={() => {}}>
          <span>Produkte (25)</span>
        </SearchTab>
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('(not active) renders and matches snapshot', () => {
    const snapshot = createSnapshot(
      <ContextWrapper>
        <SearchTab searchProviderId="TEST" isActive={false} onClick={() => {}}>
          <span>Produkte (25)</span>
        </SearchTab>
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });
});
