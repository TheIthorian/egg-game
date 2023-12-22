export class AppError extends Error {}

export class DatabaseDecryptionError extends AppError {
    constructor() {
        super('Unable to decrypt data. Invalid password provided.');
    }
}
