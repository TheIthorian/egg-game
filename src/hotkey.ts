export function registerHotkeys(mappings: Record<string, () => void>) {
    window.addEventListener('keypress', (e: KeyboardEvent) => {
        const callback = mappings[e.key];

        if (callback) callback();
    });
}
