import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import VariationDetail from './VariationDetail';

describe('VariationDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <VariationDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});