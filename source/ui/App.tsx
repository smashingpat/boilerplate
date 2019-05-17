import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Link, Switch, Route } from 'react-router-dom';
import './styles.scss';
import { paths, routes } from './routes';

function App() {
    return (
        <>
            <nav>
                <Link to={paths.todo}>todos</Link>
                <Link to={paths.about}>about</Link>
            </nav>
            <main>
                <Switch>
                    {routes.map(route => (
                        <Route
                            key={route.path}
                            exact
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </Switch>
            </main>
        </>
    );
}

export default hot(module)(App);
