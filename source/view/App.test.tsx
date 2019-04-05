import * as React from 'react';
import { render, cleanup } from 'react-testing-library';
import App from './App';

afterEach(cleanup);

describe('<App />', () => {
    it('should render without crashing', () => {
        render(<App />);
    });
});
