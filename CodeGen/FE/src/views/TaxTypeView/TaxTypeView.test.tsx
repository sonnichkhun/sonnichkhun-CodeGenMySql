import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';
import TaxTypeView from './TaxTypeView';

describe('TaxTypeView', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <TaxTypeView/>
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});