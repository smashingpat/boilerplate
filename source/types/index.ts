declare module "*.css" {
    interface ClassNames { [key: string]: string | undefined; }
    const classNames: ClassNames;
    export default classNames;
}
