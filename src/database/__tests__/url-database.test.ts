import { UrlDatabase } from '../url-database';
import { SimpleEncryptor } from '../../encryption';
import { DatabaseDecryptionError } from '../../errors';
import { IUrlManager } from '../../types';
import { config } from '../../config';

class MockUrlManager implements IUrlManager {
    private urlState: string = '';

    getUrlState(): string {
        return this.urlState;
    }

    setUrlState(value: string): void {
        this.urlState = value;
    }
}

describe('UrlDatabase', () => {
    let urlDatabase: UrlDatabase, urlManager: MockUrlManager, dataEncryptor: SimpleEncryptor;
    const password = 'password';
    const dataPublisher = { publish: () => {} };

    beforeEach(() => {
        urlManager = new MockUrlManager();
        dataEncryptor = new SimpleEncryptor(config.encryptionKey);
        urlDatabase = new UrlDatabase(dataEncryptor, password, urlManager, dataPublisher);
    });

    describe('setAll', () => {
        it('should set the url state', async () => {
            const data = { key1: 'value1', key2: 'value2' };
            await urlDatabase.setAll(data);

            expect(urlManager.getUrlState()).toBe('FRg5AS03GRxzW11aFAw1ABM4JxxzWEVaEVMlRjoGO1JzX2hbEiklHzoGOF0=');
            expect(await urlDatabase.getAll()).toStrictEqual(data);
        });
    });

    describe('set', () => {
        it('should set the value for a given key', async () => {
            const key = 'key1';
            const value = 'value1';

            await urlDatabase.set(key, value);

            expect(urlManager.getUrlState()).toBe('FRg5AS03GRxzW11aFAw1ABM4JxxzXwIO');
            expect(await urlDatabase.get(key)).toBe(value);
        });
    });

    describe('get', () => {
        it('should return default value if key is not found', async () => {
            const defaultValue = 'default';
            const result = await urlDatabase.get('nonexistentKey', defaultValue);
            expect(result).toBe(defaultValue);
        });

        it('should return value from stored state', async () => {
            urlManager.setUrlState('FRg5AS03GRxzW11aFAw1ABM4JxxzWEVaEVMlRjoGO1JzX2hbEiklHzoGOF0='); // { key1: 'value1', key2: 'value2' }
            const result = await urlDatabase.get('key1');
            expect(result).toBe('value1');
        });
    });

    describe('getAll', () => {
        it('should return an empty object if no data is stored', async () => {
            const result = await urlDatabase.getAll();
            expect(result).toEqual({});
        });

        it('should throw DatabaseDecryptionError on decryption error', async () => {
            const encryptedData = 'invalidEncryptedData';
            urlManager.setUrlState(encryptedData);

            await expect(urlDatabase.getAll()).rejects.toThrow(DatabaseDecryptionError);
        });
    });
});
