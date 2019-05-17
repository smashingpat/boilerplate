export default function joinClassNames(
    ...classNames: (string | false | undefined | null)[]
) {
    return classNames.filter(Boolean).join(' ');
}
