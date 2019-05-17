import * as React from 'react';
import joinClassNames from '~source/utils/join-class-names';
import TodoContainer from './todo.container';
import styles from './todo.scss';

type Props = {
    label: string;
    completed: boolean;
    onCompletedClick?: (completed: boolean) => void;
    onDeleteClick?: () => void;
};

type ComponentType = React.FunctionComponent<Props> & {
    Container: typeof TodoContainer;
};

const Todo: ComponentType = ({
    label,
    completed,
    onCompletedClick,
    onDeleteClick,
}) => {
    const inputId = React.useMemo(
        () => `id__${Math.floor(Math.random() * 1e10)}`,
        [],
    );
    const completedHandler = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            if (onCompletedClick) onCompletedClick(ev.target.checked);
        },
        [onCompletedClick],
    );
    const deleteHandler = React.useCallback(() => {
        if (onDeleteClick) onDeleteClick();
    }, [onDeleteClick]);

    return (
        <div
            className={joinClassNames(
                styles.todo,
                completed && styles.isCompleted,
            )}
        >
            <label
                htmlFor={inputId}
                className={joinClassNames(styles.todoCheckbox, styles.checkbox)}
            >
                <input
                    id={inputId}
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={completed}
                    onChange={completedHandler}
                />
                <div className={styles.checkboxBox} />
            </label>
            <span className={styles.todoLabel}>{label}</span>
            <button
                type="button"
                onClick={deleteHandler}
                className={styles.todoDelete}
            >
                ×
            </button>
        </div>
    );
};

Todo.Container = TodoContainer;

export default Todo;
