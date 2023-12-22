import { DataEncryptor } from './encryption/types';
import { DatabaseDecryptionError } from './errors';
import { IUrlManager } from './types';
import { base64ToHex, base64ToUnicode, hexToBase64, unicodeToBase64 } from './util';

export class UrlDatabase {
    constructor(
        private readonly dataEncryptor: DataEncryptor,
        private password: string,
        private readonly urlManager: IUrlManager
    ) {}

    public setPassword(password: string) {
        this.password = password;
    }

    /**
     * Get a the value for a given database key
     * @throws `DatabaseDecryptionError`
     */
    public async get<T>(key: string, defaultValue?: T): Promise<T | null> {
        const allData = await this.getAll();
        return <T>allData[key] ?? defaultValue ?? null;
    }

    public async getAll(): Promise<Record<string, unknown>> {
        try {
            const dataString = (await this.getDatabaseJsonString()) ?? '{}';
            return JSON.parse(dataString) as Record<string, string>;
        } catch (error) {
            console.error(error);
            throw new DatabaseDecryptionError();
        }
    }

    public async set<T>(key: string, value: T) {
        const allData = await this.getAll();
        allData[key] = value;

        await this.setDatabaseJsonString(JSON.stringify(allData));
    }

    public async setAll(value: Record<string, unknown>) {
        this.setDatabaseJsonString(JSON.stringify(value));
    }

    public async getDatabaseJsonString(): Promise<string | null> {
        const encryptedDataStringBase64 = this.urlManager.getUrlState();
        console.log({ encryptedDataStringBase64, password: this.password });

        if (!encryptedDataStringBase64) return null;

        const encryptedDataStringHex = base64ToHex(encryptedDataStringBase64);
        let decryptedDataString = await this.dataEncryptor.decrypt(encryptedDataStringHex, this.password);

        console.log({ decryptedDataString });

        const unicodeString = base64ToUnicode(decryptedDataString);
        console.log({ unicodeString });

        return unicodeString;
    }

    public async setDatabaseJsonString(value: string): Promise<void> {
        const encryptedString = await this.dataEncryptor.encrypt(unicodeToBase64(value), this.password);

        const encryptedStringBase64 = hexToBase64(encryptedString);

        this.urlManager.setUrlState(encryptedStringBase64);
    }
}
