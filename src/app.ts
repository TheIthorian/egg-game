import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { UrlDatabase, UrlManager } from './database';
import { config } from './config';
import { ErrorContainer } from './components/error-container';
import { UrlDatabaseShowcase } from './components/url-database-showcase';

export class App {
    private errorContainer: ErrorContainer;
    private urlDatabaseShowcase: UrlDatabaseShowcase;

    constructor(
        private readonly root: HTMLElement,
        private readonly dataEncryptor: DataEncryptor,
        private database: UrlDatabase
    ) {}

    public static newInstance(root: HTMLElement) {
        const encryptor = new SimpleEncryptor(config.encryptionKey);
        return new App(root, encryptor, new UrlDatabase(encryptor, '123', new UrlManager()));
    }

    private attachComponents() {
        this.errorContainer = new ErrorContainer().insert(this.root);
        this.urlDatabaseShowcase = new UrlDatabaseShowcase(this.dataEncryptor, this.database).insert(this.root, {
            onError: (error: Error) => this.handleError(error),
        });
    }

    public async main() {
        try {
            this.attachComponents();
        } catch (error) {
            this.handleError(error);
        }
    }

    public handleError(error: Error) {
        this.errorContainer.setError(error);
    }
}
