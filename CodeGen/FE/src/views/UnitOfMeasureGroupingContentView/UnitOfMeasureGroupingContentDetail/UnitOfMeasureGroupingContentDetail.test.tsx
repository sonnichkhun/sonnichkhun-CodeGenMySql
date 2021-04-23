import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import UnitOfMeasureGroupingContentDetail from './UnitOfMeasureGroupingContentDetail';

describe('UnitOfMeasureGroupingContentDetail', () => {
  it('renders without crashing', async () => {
    const node: React.ReactElement<any> = (
      <MemoryRouter>
        <UnitOfMeasureGroupingContentDetail/>
      </MemoryRouter>
    );
    expect(node).toBeTruthy();
  });
});