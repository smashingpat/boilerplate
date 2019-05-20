import * as ApiService from '../services/my-awesome-todo-api';
import withFetchResponse from './withFetchResponse';
import Todo from '../models/todo';

function transformEntity(data: ApiService.TodoEntity): Todo {
    return new Todo({
        // eslint-disable-next-line no-underscore-dangle
        id: data._id,
        label: data.text,
        completed: data.done,
        date: new Date(data.timestamp * 1000),
    });
}
const createNewTodo = withFetchResponse((label: string) => {
    return ApiService.createNewTodo(label).then(transformEntity);
});
const deleteTodo = withFetchResponse(async (todoId: string) => {
    return ApiService.deleteTodo(todoId);
});
const getAllTodos = withFetchResponse(() => {
    return ApiService.getAllTodos().then(d => d.map(transformEntity));
});
const getTodo = withFetchResponse((todoId: string) => {
    return ApiService.getTodo(todoId).then(transformEntity);
});
const updateTodo = withFetchResponse(
    (todoId: string, changes: { completed?: boolean; label?: string }) => {
        return ApiService.updateTodo(todoId, {
            done: changes.completed,
            text: changes.label,
        });
    },
);

export { createNewTodo, deleteTodo, getAllTodos, getTodo, updateTodo };
