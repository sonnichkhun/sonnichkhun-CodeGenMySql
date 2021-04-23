import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ItemDetail from './ItemDetail';

describe('ItemDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ItemDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});