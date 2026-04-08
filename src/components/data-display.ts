import { htmlEncode } from '../util';

/**
 * Shows the current persisted state as formatted debug JSON.
 */
export class DataDisplay {
    private container: HTMLDivElement;
    private data: Record<string, unknown>;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        parent.appendChild(this.container);
        this.toggleDisplay();
        return this;
    }

    public setData(data: Record<string, unknown>) {
        this.data = data;

        this.container.innerHTML = `<pre style='position: absolute; left: 50px; top: 70px'>${htmlEncode(
            this.getDisplayText()
        )}</pre>`;
    }

    private getDisplayText() {
        return JSON.stringify(this.data, null, 4);
    }

    public toggleDisplay() {
        this.container.classList.toggle('hidden');
    }
}
