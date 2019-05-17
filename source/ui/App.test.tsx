import * as React from 'react';
import { render } from '~source/utils/test-utils';
import App from './App';

it('should render into the document', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
});
