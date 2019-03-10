import * as React from 'react';
import cx from 'classnames';
import { hot } from 'react-hot-loader';
import { Switch, Route, NavLink } from 'react-router-dom';
import { routes, paths } from './routes';
import styles from './App.scss';


function App() {
    return (
        <div className={styles.app}>
            <main className={styles.appMain}>
                <Switch>
                    {routes.map(route => (
                        <Route key={route.path} {...route} />
                    ))}
                </Switch>
            </main>
            <nav className={cx(styles.appNavigation, styles.navigation)}>
                <NavLink className={styles.navigationLink} to={paths.overview}>overview</NavLink>     
            </nav>
        </div>
    );
}

export default hot(module)(App);
