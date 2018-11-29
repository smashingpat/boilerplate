declare module 'hoist-non-react-statics' {
    import * as React from 'react';

    function hoistNonReactStatics<Target extends React.ComponentType, Source extends React.ComponentType>(
        targetComponent: Target,
        sourceComponent: Source
    ): Target & Source

    export default hoistNonReactStatics;
}
