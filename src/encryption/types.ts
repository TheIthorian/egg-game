export interface DataEncryptor {
    encrypt(stringToEncrypt: string, password: string): Promise<string>;
    decrypt(stringToDecrypt: string, password: string): Promise<string>;
}
