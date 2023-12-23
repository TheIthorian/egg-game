import { UrlDatabase } from '../database/url-database';
import { DataEncryptor } from '../encryption/types';
import { base64ToUnicode, hexToBase64, unicodeToBase64 } from '../util';

type ErrorHandler = (error: Error) => void;

type UrlDatabaseShowcaseProps = {
    onError: ErrorHandler;
};

export class UrlDatabaseShowcase {
    private textInput: HTMLDivElement;
    onError: ErrorHandler;

    constructor(private readonly dataEncryptor: DataEncryptor, private readonly database: UrlDatabase) {}

    public insert(parent: HTMLElement, { onError }: UrlDatabaseShowcaseProps) {
        this.onError = onError;

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

        this.textInput.addEventListener('change', () => this.handleInputChange().catch(error => this.onError(error)));
        parent.appendChild(this.textInput);
        this.handleInputChange().catch(error => this.onError(error));

        return this;
    }

    private async handleInputChange() {
        const input = this.textInput.querySelector<HTMLInputElement>('#input')?.value ?? '';
        const password = this.textInput.querySelector<HTMLInputElement>('#password')?.value ?? '';

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
        const element = this.textInput.querySelector<HTMLDivElement>(id);
        if (element) {
            element.innerText = value;
        }
    }
}
