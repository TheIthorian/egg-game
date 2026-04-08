/**
 * Renders user-visible runtime errors into a dedicated DOM node.
 */
export class ErrorContainer {
    private errorElement: HTMLDivElement;
    private errorMessageElement: HTMLParagraphElement;
    private restartButton: HTMLButtonElement;

    constructor(private readonly onRestart: () => void) {}

    public insert(parent: HTMLElement) {
        this.errorElement = document.createElement('div');
        this.errorElement.classList.add('error');

        this.errorMessageElement = document.createElement('p');
        this.restartButton = document.createElement('button');
        this.restartButton.classList.add('hidden');
        this.restartButton.innerText = 'Restart';
        this.restartButton.addEventListener('click', this.onRestart);

        this.errorElement.appendChild(this.errorMessageElement);
        this.errorElement.appendChild(this.restartButton);
        parent.appendChild(this.errorElement);

        return this;
    }

    public setError(error: Error) {
        this.errorMessageElement.innerText = `Error: ${error.message}`;
        this.restartButton.classList.remove('hidden');
    }
}
