import * as TodosApiRepository from '../repositories/todos-api';

async function createTodo(label: string) {
    const response = await TodosApiRepository.createNewTodo(label);
    if (response.success) {
        return {
            type: 'success',
            todo: response.data,
        } as const;
    }

    return {
        type: 'error',
        message: response.message,
    } as const;
}

async function deleteTodo(todoId: string) {
    const response = await TodosApiRepository.deleteTodo(todoId);
    if (response.success) {
        return { type: 'success' } as const;
    }
    return { type: 'error', message: response.message } as const;
}

async function getTodos() {
    const response = await TodosApiRepository.getAllTodos();
    if (response.success) {
        return { type: 'success', todos: response.data } as const;
    }
    return { type: 'error', message: response.message } as const;
}

async function updateCompleted(todoId: string, completed: boolean) {
    const updatedResponse = await TodosApiRepository.updateTodo(todoId, {
        completed,
    });
    if (!updatedResponse.success)
        return {
            type: 'error',
            message: updatedResponse.message,
        } as const;
    const todoResponse = await TodosApiRepository.getTodo(todoId);
    if (!todoResponse.success)
        return {
            type: 'error',
            message: todoResponse.message,
        } as const;
    return { type: 'success', todo: todoResponse.data } as const;
}

export { createTodo, deleteTodo, getTodos, updateCompleted };
