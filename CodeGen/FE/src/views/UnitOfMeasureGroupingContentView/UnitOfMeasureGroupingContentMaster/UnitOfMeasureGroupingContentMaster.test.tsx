import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import UnitOfMeasureGroupingContentMaster from './UnitOfMeasureGroupingContentMaster';

describe('UnitOfMeasureGroupingContentMaster', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <UnitOfMeasureGroupingContentMaster/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});