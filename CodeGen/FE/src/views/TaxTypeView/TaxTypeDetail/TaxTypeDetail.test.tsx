import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import TaxTypeDetail from './TaxTypeDetail';

describe('TaxTypeDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <TaxTypeDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});