import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ProductGroupingDetail from './ProductGroupingDetail';

describe('ProductGroupingDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductGroupingDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
