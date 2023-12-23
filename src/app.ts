import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { UrlDatabase, UrlManager } from './database';
import { config } from './config';
import { base64ToUnicode, unicodeToBase64, hexToBase64 } from './util';

export class App {
    private errorElement: HTMLDivElement;
    private textInput: HTMLDivElement;

    constructor(
        private readonly root: HTMLElement,
        private readonly dataEncryptor: DataEncryptor,
        private database: UrlDatabase
    ) {
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
        <input id='input' name='input' value='{ "key1": "value1", "key2": "value2" }' />
        <label for='password'>Password</label>
        <input id='password' name='input' value='password' />

        <div id='output-input'></div>
        <div id='output-base64'></div>
        <br>
        <div id='output-encrypted'></div>
        <div id='output-encrypted-base64'></div>
        <br>
        <div id='output-decrypted'></div>
        <div id='output-decrypted-base64-decoded'></div>
        <br>
        <div id='output-database-value'></div>
        `;

        this.textInput.addEventListener('change', () =>
            this.handleInputChange().catch(error => this.handleError(error))
        );
        this.root.appendChild(this.textInput);
        this.handleInputChange().catch(error => this.handleError(error));
    }

    private async handleInputChange() {
        const input = this.textInput.querySelector<HTMLInputElement>('#input').value;
        const password = this.textInput.querySelector<HTMLInputElement>('#password').value;

        const jsonInput = JSON.parse(input);
        const jsonStringInput = JSON.stringify(jsonInput);
        const encrypted = await this.dataEncryptor.encrypt(unicodeToBase64(jsonStringInput), password);
        const decrypted = await this.dataEncryptor.decrypt(encrypted, password);

        this.setTextForElement('#output-input', 'Input: ' + jsonStringInput);
        this.setTextForElement('#output-base64', 'Input (Base64): ' + unicodeToBase64(jsonStringInput));

        this.setTextForElement('#output-encrypted', 'Encrypted: ' + encrypted);
        this.setTextForElement('#output-encrypted-base64', 'Encrypted (Base64): ' + hexToBase64(encrypted));

        this.setTextForElement('#output-decrypted', 'Decrypted (Base64): ' + decrypted);
        this.setTextForElement(
            '#output-decrypted-base64-decoded',
            'Decrypted (original): ' + base64ToUnicode(decrypted)
        );

        this.database.setPassword(password);
        await this.database.setAll(JSON.parse(input));

        this.setTextForElement(
            '#output-database-value',
            'Database json string: ' + JSON.stringify(await this.database.getDatabaseJsonString())
        );
    }

    private setTextForElement(id: string, value: string) {
        this.textInput.querySelector<HTMLDivElement>(id).innerText = value;
    }

    public static newInstance(root: HTMLElement) {
        const encryptor = new SimpleEncryptor(config.encryptionKey);
        return new App(root, encryptor, new UrlDatabase(encryptor, '123', new UrlManager()));
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
