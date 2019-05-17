import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '~source/ui/App';

const mountElement = document.getElementById('app');

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    mountElement,
);
