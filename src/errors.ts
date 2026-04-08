/**
 * Base class for application-specific runtime errors.
 */
export class AppError extends Error {}

/**
 * Raised when URL-backed state cannot be decrypted into valid application data.
 */
export class DatabaseDecryptionError extends AppError {
    constructor() {
        super('Unable to decrypt data. Invalid password provided.');
    }
}
