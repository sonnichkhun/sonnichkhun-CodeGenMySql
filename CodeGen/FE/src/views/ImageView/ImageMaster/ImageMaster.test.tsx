import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import ImageMaster from './ImageMaster';

describe('ImageMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <ImageMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});