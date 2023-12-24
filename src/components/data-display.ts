import { htmlEncode } from '../util';

export class DataDisplay {
    private container: HTMLDivElement;
    private data: Record<string, unknown>;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');

        window.addEventListener('dataChange', ((e: CustomEvent<{ data: Record<string, unknown> }>) => {
            const data = e.detail.data as Record<string, unknown>;
            this.setData(data);
        }) as EventListener);

        parent.appendChild(this.container);

        return this;
    }

    public setData(data: Record<string, unknown>) {
        this.data = data;

        this.container.innerHTML = `<pre style='position: absolute; left: 50px; bottom: 50px'>${htmlEncode(
            this.getDisplayText()
        )}</pre>`;
    }

    private getDisplayText() {
        return JSON.stringify(this.data, null, 4);
    }
}
