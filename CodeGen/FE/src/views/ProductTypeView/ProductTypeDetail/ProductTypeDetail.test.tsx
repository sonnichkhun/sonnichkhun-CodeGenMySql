import React from 'react';
import { MemoryRouter } from 'react-router-dom';


describe('ProductTypeDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ProductTypeDetail />
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});
