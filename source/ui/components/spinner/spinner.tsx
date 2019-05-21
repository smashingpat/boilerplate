import * as React from 'react';
import joinClassNames from '~source/utils/join-class-names';
import styles from './spinner.css';

type Props = {
    className?: string;
};

const Spinner: React.FunctionComponent<Props> = ({ className }) => {
    return <span className={joinClassNames(styles.spinner, className)} />;
};

export default Spinner;
