import Todo from '../models/todo';

// Helpers
const wait = (timeout = 200) => new Promise(r => setTimeout(r, timeout));
function createTodo(label: string, completed = false): Todo {
    return new Todo({
        id: `${Math.ceil(Math.random() * 1e10)}`,
        label,
        completed,
        date: new Date(),
    });
}

function saveLocal(data: Todo[]) {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem('todos', stringifiedData);
    return stringifiedData;
}

function getLocal(): Todo[] {
    const localValue = localStorage.getItem('todos');
    return JSON.parse(
        localValue ||
            saveLocal([
                createTodo('create a todo', true),
                createTodo('complete this todo'),
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
    return todos.find(t => t.id === todoId) || null;
}

export async function createNewTodo(label: string) {
    await wait(200);
    const todos = getLocal();
    const newTodo = createTodo(label);
    saveLocal(todos.concat(newTodo));

    return newTodo;
}

export async function updateTodo(
    todoId: string,
    changes: { completed?: boolean; label?: string },
) {
    await wait(200);
    const todos = getLocal();
    const updatedTodos = todos.map(todo => {
        if (todo.id === todoId) {
            // eslint-disable-next-line no-param-reassign
            if (changes.label !== undefined) todo.label = changes.label;
            if (changes.completed !== undefined)
                // eslint-disable-next-line no-param-reassign
                todo.completed = changes.completed;
        }
        return todo;
    });
    saveLocal(updatedTodos);
}

export async function deleteTodo(todoId: string) {
    await wait(200);
    const todos = getLocal();
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    saveLocal(updatedTodos);
}
