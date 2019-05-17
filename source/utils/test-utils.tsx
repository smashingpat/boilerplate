import * as React from 'react';
import { render as rtlRender, fireEvent, act } from 'react-testing-library';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

function render(ui: React.ReactElement) {
    const history = createMemoryHistory();
    function AppWrapper({ children }: React.PropsWithChildren<{}>) {
        return <Router history={history}>{children}</Router>;
    }
    return {
        ...rtlRender(ui, { wrapper: AppWrapper }),
        history,
    };
}

export { render, fireEvent, act };
