import * as React from 'react';
import * as TodosInteractor from '~source/core/interactors/todos';
import Todo from '~source/core/models/todo';
import usePending from './use-pending';

interface State {
    todos: Todo[];
}

type Action =
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
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
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
    const [pending, wrapPending] = usePending();

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
        pending,
        refreshTodos,
        updateCompleted,
        createTodo,
        deleteTodo,
    };
}
