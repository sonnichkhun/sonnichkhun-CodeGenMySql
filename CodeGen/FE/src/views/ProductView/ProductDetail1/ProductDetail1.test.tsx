import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router-dom';

import ProductDetail1 from './ProductDetail1';

describe('ProductDetail1', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <MemoryRouter>
                <ProductDetail1/>
            </MemoryRouter>,
            div,
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
