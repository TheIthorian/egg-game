export class ErrorContainer {
    private errorElement: HTMLDivElement;

    public insert(parent: HTMLElement) {
        this.errorElement = document.createElement('div');
        this.errorElement.classList.add('error');
        parent.appendChild(this.errorElement);

        return this;
    }

    public setError(error: Error) {
        this.errorElement.innerText = `Error: ${error.message}`;
    }
}
