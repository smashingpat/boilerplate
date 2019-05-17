import * as TodosApiRepository from '../repositories/todos-api';

function createResponse<T>(
    data: T,
    error?: undefined,
): { data: T; message: string; success: true };
function createResponse<T>(
    data: T,
    error: true | string,
): { data: T; message: string; success: false };
function createResponse<T, M>(data: T, error: string | true = '') {
    return {
        data,
        message: error === true ? '' : error,
        success: !error,
    };
}

async function createTodo(label) {
    try {
        return createResponse(await TodosApiRepository.createNewTodo(label));
    } catch {
        return createResponse(null, 'something went wrong');
    }
}

async function deleteTodo(todoId: string) {
    try {
        return createResponse(await TodosApiRepository.deleteTodo(todoId));
    } catch {
        return createResponse(null, 'something went wrong');
    }
}

async function getTodos() {
    try {
        return createResponse(await TodosApiRepository.getAllTodos());
    } catch {
        return createResponse(null, 'something went wrong');
    }
}

async function updateCompleted(todoId: string, completed: boolean) {
    try {
        await TodosApiRepository.updateTodo(todoId, { completed });
        const updatedTodo = await TodosApiRepository.getTodo(todoId);
        if (updatedTodo === null) throw new Error('could not find todo');
        return createResponse(updatedTodo);
    } catch (err) {
        return createResponse(null, 'something went wrong');
    }
}

export { createTodo, deleteTodo, getTodos, updateCompleted };
