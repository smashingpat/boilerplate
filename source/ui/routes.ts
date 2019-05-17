import TodoView from './views/todo-view';
import AboutView from './views/about-view';

export const paths = {
    todo: '/',
    about: '/about',
};

export const routes = [
    {
        path: paths.todo,
        component: TodoView,
    },
    {
        path: paths.about,
        component: AboutView,
    },
];
