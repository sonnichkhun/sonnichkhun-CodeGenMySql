import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ImageDetail from './ImageDetail';

describe('ImageDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ImageDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});