import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import VariationGroupingDetail from './VariationGroupingDetail';

describe('VariationGroupingDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <VariationGroupingDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});