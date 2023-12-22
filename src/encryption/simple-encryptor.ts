import { DataEncryptor } from './types';

export class SimpleEncryptor implements DataEncryptor {
    constructor(private readonly key: string) {}

    public async encrypt(stringToEncrypt: string, password: string): Promise<string> {
        const key = this.getKey(password);

        return [...stringToEncrypt]
            .map((x, i) => (x.codePointAt(0) ^ key.charCodeAt(i % key.length) % 255).toString(16).padStart(2, '0'))
            .join('');
    }

    public async decrypt(stringToDecrypt: string, password: string) {
        const key = this.getKey(password);

        return String.fromCharCode(
            ...stringToDecrypt.match(/.{1,2}/g).map((e, i) => parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255)
        );
    }

    private getKey(password: string): string {
        return `${password}:${this.key}`;
    }
}
