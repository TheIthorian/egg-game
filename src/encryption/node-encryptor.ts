import crypto from 'crypto';
import { DataEncryptor } from './types';

const ALGORITHM = 'aes256';
const ENCODING = 'base64';
const HASH_ALGORITHM = 'sha512';

export class NodeEncryptor implements DataEncryptor {
    constructor(private readonly key: string) {}

    public async encrypt(stringToEncrypt: string, password: string): Promise<string> {
        const key = this.getKey(password);

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(stringToEncrypt, 'utf-8', ENCODING);
        encrypted += cipher.final(ENCODING);

        return [encrypted, Buffer.from(iv).toString('base64')].join('.');
    }

    public async decrypt(stringToDecrypt: string, password: string) {
        const key = this.getKey(password);

        const [value, iv] = stringToDecrypt.split('.');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64'));

        let decrypted = decipher.update(value, ENCODING, 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    }

    private getKey(password: string): Buffer {
        const encryptionSecret = `${password}:${this.key}`;
        const hash = crypto.createHash(HASH_ALGORITHM).update(encryptionSecret);
        const key = hash.digest().subarray(0, 32);
        return key;
    }
}
