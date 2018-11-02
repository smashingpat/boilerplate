// CSS Modules
declare module "*.css" {
    interface ClassNames { [key: string]: string | undefined; }
    const classNames: ClassNames;
    export default classNames;
}

declare module "*.scss" {
    interface ClassNames { [key: string]: string | undefined; }
    const classNames: ClassNames;
    export default classNames;
}

// filePaths
declare module "*.jpg" {
    const path: string;
    export default path;
}
declare module "*.png" {
    const path: string;
    export default path;
}
declare module "*.gif" {
    const path: string;
    export default path;
}
