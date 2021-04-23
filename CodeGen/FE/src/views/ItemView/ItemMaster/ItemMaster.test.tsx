import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ItemMaster from './ItemMaster';

describe('ItemMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ItemMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});