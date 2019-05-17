import * as React from 'react';
import styles from './todo.scss';

type Props = {
    onSubmit?: (label: string) => void;
};

const TodoContainer: React.FunctionComponent<Props> = ({
    children,
    onSubmit,
}) => {
    const [label, setLabel] = React.useState('');
    const handleForm = React.useCallback(
        (ev: React.FormEvent) => {
            ev.preventDefault();
            if (onSubmit) {
                onSubmit(label);
            }
            setLabel('');
        },
        [label, onSubmit],
    );
    return (
        <div className={styles.container}>
            {children}
            <form onSubmit={handleForm} className={styles.containerForm}>
                <input
                    className={styles.containerInput}
                    type="text"
                    onChange={ev => setLabel(ev.target.value)}
                    value={label}
                />
                <input
                    type="submit"
                    className={styles.containerButton}
                    value="Create todo"
                />
            </form>
        </div>
    );
};

export default TodoContainer;
