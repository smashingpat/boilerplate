import * as React from 'react';

// Extra types from React 16.5.4 -> 16.6.0
declare module 'react' {
    export const Suspense: React.ComponentType<{ fallback: React.ReactNode }>
    export function memo<C extends React.ComponentType<any>>(Component: C): C
    export function lazy<C extends React.ComponentType<any>>(
        promise: () => Promise<{ default: C }>
    ): C
}
