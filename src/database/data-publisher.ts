export class DataPublisher {
    publish(data: Record<string, unknown>) {
        const event = new CustomEvent<Record<string, unknown>>('dataChange', {
            detail: { data },
        });

        window.dispatchEvent(event);
    }
}
