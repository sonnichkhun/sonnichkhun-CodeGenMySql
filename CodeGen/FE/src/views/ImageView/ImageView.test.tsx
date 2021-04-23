import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';
import ImageView from './ImageView';

describe('ImageView', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <ImageView/>
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});