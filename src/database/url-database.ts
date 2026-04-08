import { DataEncryptor } from '../encryption/types';
import { DatabaseDecryptionError } from '../errors';
import { IUrlManager } from '../types';
import { base64ToHex, base64ToUnicode, hexToBase64, unicodeToBase64 } from '../util';
import { DataPublisher } from './data-publisher';

/**
 * Persists the entire game state object into the `state` query parameter and republishes updates.
 */
export class UrlDatabase {
    constructor(
        private readonly dataEncryptor: DataEncryptor,
        private password: string,
        private readonly urlManager: IUrlManager,
        private readonly dataPublisher: DataPublisher
    ) {}

    public setPassword(password: string) {
        this.password = password;
    }

    /**
     * Returns the value for one state key, or the provided default when the key is absent.
     * @throws `DatabaseDecryptionError`
     */
    public async get<T>(key: string, defaultValue?: T): Promise<T | null> {
        const allData = await this.getAll();
        return <T>allData[key] ?? defaultValue ?? null;
    }

    /**
     * Loads, decrypts, and parses the full persisted state object from the URL.
     */
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

        this.dataPublisher.publish(allData);
        await this.setDatabaseJsonString(JSON.stringify(allData));
    }

    /**
     * Replaces one state key using its current value, then persists and republishes the result.
     */
    public async update<T>(key: string, updater: (currentValue?: T) => Promise<T> | T) {
        const currentValue = await this.get<T>(key);
        const newValue = await updater(currentValue);
        await this.set(key, newValue);
    }

    /**
     * Replaces the full state object in one write operation.
     */
    public async setAll(value: Record<string, unknown>) {
        this.dataPublisher.publish(value);
        this.setDatabaseJsonString(JSON.stringify(value));
    }

    /**
     * Clears all persisted state from the backing store.
     */
    public drop() {
        this.urlManager.clearUrlState();
    }

    /**
     * Reads the raw persisted JSON string after URL decoding and decryption, before parsing.
     */
    public async getDatabaseJsonString(): Promise<string | null> {
        const encryptedDataStringBase64 = this.urlManager.getUrlState();

        if (!encryptedDataStringBase64) return null;

        const encryptedDataStringHex = base64ToHex(encryptedDataStringBase64);
        const decryptedDataString = await this.dataEncryptor.decrypt(encryptedDataStringHex, this.password);

        const unicodeString = base64ToUnicode(decryptedDataString);
        return unicodeString;
    }

    /**
     * Serializes and stores the provided JSON string back into the URL-safe encrypted representation.
     */
    public async setDatabaseJsonString(value: string): Promise<void> {
        const encryptedString = await this.dataEncryptor.encrypt(unicodeToBase64(value), this.password);

        const encryptedStringBase64 = hexToBase64(encryptedString);

        this.urlManager.setUrlState(encryptedStringBase64);
    }
}
