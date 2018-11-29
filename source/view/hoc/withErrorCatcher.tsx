import * as React from "react";
import hoistStatics from "hoist-non-react-statics";
import { createDisplayName } from "./utils";

export default function withErrorCatcher<P>(WrappedComponent: React.ComponentType<P>) {
    interface ErrorCatcherState {
        errorInfo: React.ErrorInfo | null;
    }

    class ErrorCatcher extends React.Component<P, ErrorCatcherState> {
        static displayName = createDisplayName("ErrorCatcher", WrappedComponent);

        state: ErrorCatcherState = {
            errorInfo: null,
        };

        componentDidCatch(error, errorInfo) {
            this.setState({ errorInfo });
        }

        render() {
            if (this.state.errorInfo) {
                const wrapperStyles: React.CSSProperties = {
                    width: "100%",
                    overflow: "auto",
                };
                const preStyles: React.CSSProperties = {
                    backgroundColor: "tomato",
                    color: "white",
                    textShadow: "0 1px 1px rgba(0,0,0,.3)",
                    padding: "25px",
                };
                return (
                    <div style={wrapperStyles}>
                        <pre style={preStyles}>{this.state.errorInfo.componentStack.trim()}</pre>
                    </div>
                );
            }
            return <WrappedComponent {...this.props} />;
        }
    }

    return hoistStatics(ErrorCatcher, WrappedComponent);
}
