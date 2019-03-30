import React from 'react';
import { mount } from 'enzyme';
import { createSnapshot } from '@dm/jest-utils';
import ContextWrapper from '../../testutil/ContextWrapper';

import SearchFallbackSuggestions from '../SearchFallbackSuggestions';

describe('SearchFallbackSuggestions', () => {
  it('renders and matches snapshot (DE)', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="de">
        <SearchFallbackSuggestions suggestions={['hello', 'world']} />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('renders and matches snapshot (HU)', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="hu">
        <SearchFallbackSuggestions suggestions={['hello', 'world']} />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('renders and matches snapshot when duplicate suggestions are found', () => {
    const snapshot = createSnapshot(
      <ContextWrapper locale="de">
        <SearchFallbackSuggestions suggestions={['baldrian', 'balea', 'balea']} />
      </ContextWrapper>
    );
    expect(snapshot).toMatchSnapshot();
  });

  it('mounts and displays no suggestions when no suggestions are found', () => {
    const component = mount(
      <ContextWrapper>
        <SearchFallbackSuggestions suggestions={[]} />
      </ContextWrapper>
    );

    expect(component.find('[data-dmid="search-fallback-suggestions"]')).toHaveLength(0);
  });
});
