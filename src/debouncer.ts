const DEFAULT_DEBOUNCE_TIME = 100;

export function createDebouncer(debounceTime = DEFAULT_DEBOUNCE_TIME) {
    let isWaiting = false;

    return function (callback: CallableFunction) {
        if (isWaiting) return;
        isWaiting = true;

        setTimeout(() => {
            callback();
            isWaiting = false;
        }, debounceTime);
    };
}
