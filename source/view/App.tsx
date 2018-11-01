import * as React from "react";
import { createPortal } from "react-dom";
import { hot } from "react-hot-loader";
import styles from "./App.scss";

const columns = [...Array(5)].map(() => ({
    id: Math.floor(Math.random() * 1e8),
    rows: [...Array(10)].map(() => ({
        id: Math.floor(Math.random() * 1e8),
    })),
}));

interface HeaderState {
    top: number;
    left: number;
    height: number;
    width: number;
}

interface HeaderProps {}

function getElementOffset(el: HTMLElement) {
    let top = 0;
    let left = 0;
    let element = el;

    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
        left,
        top,
    };
}

class Header extends React.Component<HeaderProps, HeaderState> {
    mountElement: HTMLDivElement;

    headerRef = React.createRef<HTMLDivElement>();
    pushRef = React.createRef<HTMLDivElement>();

    constructor(props: HeaderProps) {
        super(props);
        this.state = { height: 0, width: 0, top: 0, left: 0 };
        this.mountElement = document.createElement("div");
        document.body.appendChild(this.mountElement);
    }

    componentDidMount() {
        this.setState({});
    }

    componentWillUnmount() {
        document.body.removeChild(this.mountElement);
    }

    componentDidUpdate() {
        const headerEl = this.headerRef.current;
        const pushEl = this.pushRef.current;
        if (!(headerEl && pushEl)) { return; }
        const height = headerEl.offsetHeight;
        const width = pushEl.offsetWidth;
        const { top, left } = getElementOffset(pushEl);

        if (
            (this.state.top !== top) ||
            (this.state.left !== left) ||
            (this.state.height !== height) ||
            (this.state.width !== width)
        ) {
            this.setState({ height, width, top, left });
        }
    }
    render() {
        return (
            <>
                {createPortal((
                    <div style={{ top: this.state.top, left: this.state.left, width: this.state.width }} ref={this.headerRef} className={styles.header}>header</div>
                ), this.mountElement)}
                <div ref={this.pushRef} style={{ height: this.state.height }} className={styles.headerPush} />
            </>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <section className={styles.container} onClick={() => this.forceUpdate()}>
                <div className={styles.containerInner}>
                    <Header />
                    <div className={styles.columnContainer}>
                        {columns.map((column) => (
                            <div key={column.id} className={styles.column}>
                                {column.rows.map((row) => (
                                    <div key={row.id} className={styles.row} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <Header />
                    <div className={styles.columnContainer}>
                        {columns.map((column) => (
                            <div key={column.id} className={styles.column}>
                                {column.rows.map((row) => (
                                    <div key={row.id} className={styles.row} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
}

export default hot(module)(App);
