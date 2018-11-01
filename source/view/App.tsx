import * as React from "react";
import { createPortal } from "react-dom";
import { hot } from "react-hot-loader";
import debounce from "lodash/debounce";
import styles from "./App.scss";

function getElementOffset(el: HTMLElement) {
    let top = 0;
    let left = 0;
    let element = el;

    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      // @ts-ignore ignore as there is no easy way to guard the Type
      // without the use of instanceOf HTMLElement
      element = element.offsetParent;
    } while (element);

    return {
        left,
        top,
    };
}

interface HeaderState {
    top: number;
    left: number;
    height: number;
    width: number;
}

interface HeaderProps {
    text: string;
}

class Header extends React.Component<HeaderProps, HeaderState> {
    mountElement: HTMLDivElement;

    headerRef = React.createRef<HTMLDivElement>();
    pushRef = React.createRef<HTMLDivElement>();

    handleWindowResize = debounce(() => this.setState({}), 500);

    constructor(props: HeaderProps) {
        super(props);
        this.state = { height: 0, width: 0, top: 0, left: 0 };
        this.mountElement = document.createElement("div");
        document.body.appendChild(this.mountElement);
    }

    componentDidMount() {
        this.setState({});
        window.addEventListener("resize", this.handleWindowResize);
    }

    componentWillUnmount() {
        document.body.removeChild(this.mountElement);
        window.removeEventListener("resize", this.handleWindowResize);
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
            console.log("updated location");
            this.setState({ height, width, top, left });
        }
    }
    render() {
        return (
            <>
                {createPortal((
                    <div style={{ top: this.state.top, left: this.state.left, width: this.state.width }} ref={this.headerRef} className={styles.header}>{this.props.text}</div>
                ), this.mountElement)}
                <div ref={this.pushRef} style={{ height: this.state.height }} className={styles.headerPush} />
            </>
        );
    }
}

interface AppState {
    columns: Array<{
        id: number,
        rows: Array<{
            id: number,
        }>,
    }>;
}

class App extends React.Component<{}, AppState> {
    state = {
        columns: [...Array(5)].map(() => ({
            id: Math.floor(Math.random() * 1e8),
            rows: [...Array(3)].map(() => ({
                id: Math.floor(Math.random() * 1e8),
            })),
        })),
    };
    addRow = () => this.setState((prevState) => ({
        columns: prevState.columns.map((column) => ({ ...column, rows: column.rows.concat({ id: Math.floor(Math.random() * 1e8) })})),
    }))
    render() {
        const { columns } = this.state;
        return (
            <section className={styles.container}>
                <div className={styles.containerInner}>
                    {[...Array(5)].map((_, index) => (
                        <React.Fragment key={index}>
                            <Header text={`Header ${index + 1}`} />
                            <div className={styles.columnContainer}>
                                {columns.map((column) => (
                                    <div key={column.id} className={styles.column}>
                                        {column.rows.map((row) => (
                                            <div key={row.id} className={styles.row} />
                                        ))}
                                        <button className={[ styles.row, styles.isButton ].join(" ")} onClick={this.addRow} />
                                    </div>
                                ))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </section>
        );
    }
}

export default hot(module)(App);
