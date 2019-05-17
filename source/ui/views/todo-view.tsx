import * as React from 'react';
import Todo from '../components/todo/todo';
import useTodoService from '../hooks/use-todo-service';

const TodoView: React.FunctionComponent = () => {
    const {
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
            <h1>todo view</h1>
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
