import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import TaxTypeMaster from './TaxTypeMaster';

describe('TaxTypeMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <TaxTypeMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});