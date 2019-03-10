import * as React from 'react';
import OverviewPage from '../pages/OverviewPage';

type Route = {
    path: string;
    exact: boolean;
    component: React.ComponentType;
}

export const paths = {
    overview: '/',
}

export const routes: Route[] = [
    {
        path: paths.overview,
        exact: true,
        component: OverviewPage,
    }
]
