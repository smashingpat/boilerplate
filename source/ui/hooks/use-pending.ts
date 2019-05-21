import * as React from 'react';

export default function usePending() {
    const [pendingCount, setPendingCount] = React.useState(0);
    const wrapPending = React.useCallback(
        <F extends (...args: any[]) => any>(func: F) => {
            return async (...args: Parameters<F>) => {
                setPendingCount(c => c + 1);
                await func(...args);
                setPendingCount(c => c - 1);
            };
        },
        [],
    );

    return [pendingCount > 0, wrapPending] as const;
}
