import * as React from 'react';
import Todo from '../components/todo/todo';
import useTodoService from '../hooks/use-todo-service';
import Spinner from '../components/spinner';

const TodoView: React.FunctionComponent = () => {
    const {
        pending,
        refreshTodos,
        updateCompleted,
        todos,
        createTodo,
        deleteTodo,
    } = useTodoService();

    React.useEffect(() => {
        refreshTodos();
    }, [refreshTodos]);

    return (
        <>
            <h1 style={{ display: 'flex' }}>
                <span style={{ flex: 1 }}>todo view</span>{' '}
                {pending && <Spinner />}
            </h1>
            <Todo.Container onSubmit={createTodo}>
                {todos.map(todo => {
                    return (
                        <Todo
                            key={todo.id}
                            {...todo}
                            onCompletedClick={completed =>
                                updateCompleted(todo.id, completed)
                            }
                            onDeleteClick={() => deleteTodo(todo.id)}
                        />
                    );
                })}
            </Todo.Container>
        </>
    );
};

export default TodoView;
