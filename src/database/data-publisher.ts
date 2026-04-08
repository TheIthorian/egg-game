/**
 * Broadcasts the latest persisted state to browser listeners after each write.
 */
export class DataPublisher {
    publish(data: Record<string, unknown>, previousData: Record<string, unknown> = null) {
        const event = new CustomEvent<Record<string, unknown>>('dataChange', {
            detail: { data, previousData: previousData ?? data },
        });

        window.dispatchEvent(event);
    }
}
