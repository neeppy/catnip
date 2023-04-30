export function debounce(duration: number, fn: Function) {
    let lastCallArgs: any;
    let timeoutRef: any = null;

    return function(...args: any) {
        timeoutRef && clearTimeout(timeoutRef);
        lastCallArgs = args;

        timeoutRef = setTimeout(() => fn(...lastCallArgs), duration);
    };
}
