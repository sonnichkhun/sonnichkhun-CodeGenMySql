import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import VariationGroupingMaster from './VariationGroupingMaster';

describe('VariationGroupingMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <VariationGroupingMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});