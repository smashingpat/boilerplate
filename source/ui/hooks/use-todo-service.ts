import * as React from 'react';
import * as TodosInteractor from '~source/core/interactors/todos';
import Todo from '~source/core/models/todo';

interface State {
    todos: Todo[];
    pendingCount: number;
}

type Action =
    | {
          type: 'pending';
      }
    | {
          type: 'resolved';
      }
    | {
          type: 'add_todos';
          payload: Todo[];
      }
    | {
          type: 'add_todo';
          payload: Todo;
      }
    | {
          type: 'update_todo';
          payload: Todo;
      }
    | {
          type: 'delete_todo';
          payload: Todo['id'];
      };

const initialState: State = {
    todos: [],
    pendingCount: 0,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'pending': {
            return { ...state, pendingCount: state.pendingCount + 1 };
        }
        case 'resolved': {
            return {
                ...state,
                pendingCount: Math.max(state.pendingCount - 1, 0),
            };
        }
        case 'add_todos': {
            return { ...state, todos: action.payload };
        }
        case 'add_todo': {
            return { ...state, todos: state.todos.concat(action.payload) };
        }
        case 'update_todo': {
            return {
                ...state,
                todos: state.todos.map(todo => {
                    if (todo.id === action.payload.id) {
                        return action.payload;
                    }
                    return todo;
                }),
            };
        }
        case 'delete_todo': {
            return {
                ...state,
                todos: state.todos.filter(t => t.id !== action.payload),
            };
        }
        default:
            return state;
    }
}

export default function useTodoService() {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const wrapPending = React.useCallback(
        <F extends (...args: any[]) => any>(func: F) => {
            return async (...args: Parameters<F>) => {
                dispatch({ type: 'pending' });
                await func(...args);
                dispatch({ type: 'resolved' });
            };
        },
        [],
    );
    const refreshTodos = React.useCallback(
        wrapPending(async () => {
            const response = await TodosInteractor.getTodos();
            if (response.type === 'success') {
                dispatch({ type: 'add_todos', payload: response.todos });
            }
        }),
        [],
    );
    const updateCompleted = React.useCallback(
        wrapPending(async (todoId: string, completed: boolean) => {
            const response = await TodosInteractor.updateCompleted(
                todoId,
                completed,
            );
            if (response.type === 'success') {
                dispatch({ type: 'update_todo', payload: response.todo });
            }
        }),
        [],
    );
    const createTodo = React.useCallback(
        wrapPending(async (label: string) => {
            const response = await TodosInteractor.createTodo(label);
            if (response.type === 'success') {
                dispatch({ type: 'add_todo', payload: response.todo });
            }
        }),
        [],
    );
    const deleteTodo = React.useCallback(
        wrapPending(async (todoId: string) => {
            const response = await TodosInteractor.deleteTodo(todoId);
            if (response.type === 'success') {
                dispatch({ type: 'delete_todo', payload: todoId });
            }
        }),
        [],
    );

    return {
        todos: state.todos,
        pending: state.pendingCount === 0,
        refreshTodos,
        updateCompleted,
        createTodo,
        deleteTodo,
    };
}
