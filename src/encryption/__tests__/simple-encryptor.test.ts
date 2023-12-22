import { SimpleEncryptor } from '../simple-encryptor';

describe('SimpleEncryptor', () => {
    const encryptionKey = 'dda3a3f1dd208665bdc12f7ee590f8f8d3c6787ca2c87b66e67d31fc6ea72ecb';

    it('should encrypt and decrypt data successfully', async () => {
        const encryptor = new SimpleEncryptor(encryptionKey);
        const originalString = 'Hello, World!';
        const password = 'secretpassword';

        const encryptedData = await encryptor.encrypt(originalString, password);
        const decryptedData = await encryptor.decrypt(encryptedData, password);

        expect(decryptedData).toBe(originalString);
    });

    it('should not decrypt with incorrect password', async () => {
        const encryptor = new SimpleEncryptor(encryptionKey);
        const originalString = 'Hello, World!';
        const correctPassword = 'secretpassword';
        const incorrectPassword = 'wrongpassword';

        const encryptedData = await encryptor.encrypt(originalString, correctPassword);
        await expect(encryptor.decrypt(encryptedData, incorrectPassword)).not.toBe(originalString);
    });
});
