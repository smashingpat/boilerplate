import * as React from "react";
import { Subtract } from "utility-types";
import hoistStatics from "hoist-non-react-statics";
import { createDisplayName } from "./utils";

/**
 * Adds the Context prop-types used by `withContext`
 */
export interface WithContextProps<C> {
    context: C;
}

/**
 * Injects Context into a component as `props.context`
 * @param Context The context created with `React.createContext()`
 * @param WrappedComponent The component that will be injected with the Context
 */
export default function withContext<C, P extends WithContextProps<C>>(
    Context: React.Context<C>,
    WrappedComponent: React.ComponentType<P>,
) {
    type HOCProps = Subtract<P, WithContextProps<C>>;
    const WithContextComponent: React.SFC<HOCProps> = (props) => {
        return (
            <Context.Consumer>
                {(context) => <WrappedComponent {...props} context={context} />}
            </Context.Consumer>
        );
    };
    WithContextComponent.displayName = createDisplayName("withContext", WrappedComponent);

    return hoistStatics(WithContextComponent, WrappedComponent);
}
