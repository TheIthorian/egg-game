import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { Base64ToUnicode, unicodeToBase64, hexToBase64 } from './util';

const ENCRYPTION_KEY = 'ba2904ceafcec6ef1b65fa6d43e0022eb00156fe';

export class App {
    private errorElement: HTMLDivElement;
    private textInput: HTMLDivElement;

    constructor(private readonly root: HTMLElement, private readonly dataEncryptor: DataEncryptor) {
        this.makeErrorContainer();
        this.makeTextInputs();
    }

    private makeErrorContainer() {
        this.errorElement = document.createElement('div');
        this.errorElement.classList.add('error');
        this.root.appendChild(this.errorElement);
    }

    private makeTextInputs() {
        this.textInput = document.createElement('div');
        this.textInput.innerHTML = `
        <label for='input'>Text</label>
        <input id='input' name='input' value='{"name": "Mr Person ✓"}' />
        <label for='password'>Password</label>
        <input id='password' name='input' value='123' />

        <div id='output-input'></div>
        <div id='output-base64'></div>
        <br>
        <div id='output-encrypted'></div>
        <div id='output-encrypted-base64'></div>
        <br>
        <div id='output-decrypted'></div>
        <div id='output-decrypted-base64-decoded'></div>
        `;

        this.textInput.addEventListener('change', () => this.handleInputChange());
        this.root.appendChild(this.textInput);
        this.handleInputChange();
    }

    private async handleInputChange() {
        const input = this.textInput.querySelector<HTMLInputElement>('#input').value;
        const password = this.textInput.querySelector<HTMLInputElement>('#password').value;

        const encrypted = await this.dataEncryptor.encrypt(unicodeToBase64(input), password);

        this.textInput.querySelector<HTMLDivElement>('#output-input').innerText = 'Input: ' + input;
        this.textInput.querySelector<HTMLDivElement>('#output-base64').innerText =
            'Input (Base64): ' + unicodeToBase64(input);

        this.textInput.querySelector<HTMLDivElement>('#output-encrypted').innerText = 'Encrypted: ' + encrypted;
        this.textInput.querySelector<HTMLDivElement>('#output-encrypted-base64').innerText =
            'Encrypted (Base64): ' + hexToBase64(encrypted);

        const decrypted = await this.dataEncryptor.decrypt(encrypted, password);
        this.textInput.querySelector<HTMLDivElement>('#output-decrypted').innerText = 'Decrypted: ' + decrypted;
        this.textInput.querySelector<HTMLDivElement>('#output-decrypted-base64-decoded').innerText =
            'Decrypted: ' + Base64ToUnicode(decrypted);
    }

    public static newInstance(root: HTMLElement) {
        return new App(root, new SimpleEncryptor(ENCRYPTION_KEY));
    }

    public async main() {
        try {
        } catch (error) {
            await this.handleError(error);
        }
    }

    public async handleError(error: Error) {
        this.errorElement.innerText = `Error: ${error.message}`;
    }
}
