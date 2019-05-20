/* eslint-disable no-underscore-dangle */
export interface TodoEntity {
    _id: string;
    text: string;
    done: boolean;
    timestamp: number;
}

// Helpers
const wait = (timeout = 200) => new Promise(r => setTimeout(r, timeout));
function createTodoEntity(text: string, done = false): TodoEntity {
    return {
        _id: `${Math.ceil(Math.random() * 1e10)}`,
        text,
        done,
        timestamp: Date.now() / 1000,
    };
}

function saveLocal(data: TodoEntity[]) {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem('todos', stringifiedData);
    return stringifiedData;
}

function getLocal(): TodoEntity[] {
    const localValue = localStorage.getItem('todos');
    return JSON.parse(
        localValue ||
            saveLocal([
                createTodoEntity('create a todo', true),
                createTodoEntity('complete this todo'),
            ]),
    );
}

// fetch functions
export async function getAllTodos() {
    await wait(200);
    const todos = getLocal();
    return todos;
}

export async function getTodo(todoId: string) {
    await wait(200);
    const todos = getLocal();
    return todos.find(t => t._id === todoId) || null;
}

export async function createNewTodo(label: string) {
    await wait(200);
    const todos = getLocal();
    const newTodo = createTodoEntity(label);
    saveLocal(todos.concat(newTodo));

    return newTodo;
}

export async function updateTodo(
    todoId: string,
    changes: { done?: boolean; text?: string },
) {
    await wait(200);
    const todos = getLocal();
    const updatedTodos = todos.map(todo => {
        if (todo._id === todoId) {
            // eslint-disable-next-line no-param-reassign
            if (changes.text !== undefined) todo.text = changes.text;
            if (changes.done !== undefined)
                // eslint-disable-next-line no-param-reassign
                todo.done = changes.done;
        }
        return todo;
    });
    saveLocal(updatedTodos);
}

export async function deleteTodo(todoId: string) {
    await wait(200);
    const todos = getLocal();
    const updatedTodos = todos.filter(todo => todo._id !== todoId);
    saveLocal(updatedTodos);
}
