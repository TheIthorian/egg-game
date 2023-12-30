import { htmlEncode } from '../util';

export class DataDisplay {
    private container: HTMLDivElement;
    private data: Record<string, unknown>;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        parent.appendChild(this.container);
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
