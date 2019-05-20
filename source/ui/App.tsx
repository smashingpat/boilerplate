import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Link, Switch, Route } from 'react-router-dom';
import { paths, routes } from './routes';
import './styles.scss';

function App() {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to={paths.todo}>todos</Link>
                    </li>
                    <li>
                        <Link to={paths.about}>about</Link>
                    </li>
                </ul>
            </nav>
            <main
                style={{ maxWidth: '600px', margin: '0 auto', padding: '1em' }}
            >
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
