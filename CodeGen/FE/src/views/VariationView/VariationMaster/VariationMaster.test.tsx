import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import VariationMaster from './VariationMaster';

describe('VariationMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <VariationMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});