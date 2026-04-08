/**
 * Horizontal layout container for top-level control widgets.
 */
export class UIControls {
    private container: HTMLDivElement;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'row';
        this.container.style.gap = '10px';

        parent.appendChild(this.container);
        return this;
    }

    public getDomElement() {
        return this.container;
    }
}
