import * as React from "react";

export function getDisplayName(Component: React.ComponentType) {
    return Component.displayName || Component.name || "undefined";
}

export function createDisplayName(displayName: string, Component: React.ComponentType) {
    return `${displayName}("${getDisplayName(Component)}")`;
}
