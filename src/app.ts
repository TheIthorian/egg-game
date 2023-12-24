import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { UrlDatabase, UrlManager } from './database';
import { config } from './config';
import { ErrorContainer } from './components/error-container';
import { UrlDatabaseShowcase } from './components/url-database-showcase';
import { Egg } from './components/egg';
import { DataDisplay } from './components/data-display';
import { DataPublisher } from './database/data-publisher';
import { Background } from './components/background';
import { Position } from './types';
import { createDebouncer } from './debouncer';

export class App {
    private errorContainer: ErrorContainer;
    private urlDatabaseShowcase: UrlDatabaseShowcase;
    private egg: Egg;
    private dataDisplay: DataDisplay;

    constructor(
        private readonly root: HTMLElement,
        private readonly dataEncryptor: DataEncryptor,
        private database: UrlDatabase
    ) {}

    public static newInstance(root: HTMLElement) {
        const encryptor = new SimpleEncryptor(config.encryptionKey);
        const dataPublisher = new DataPublisher();
        const urlDatabase = new UrlDatabase(encryptor, '123', new UrlManager(), dataPublisher);
        return new App(root, encryptor, urlDatabase);
    }

    public async main() {
        try {
            this.attachComponents();
            this.dataDisplay.setData(await this.database.getAll());

            const startPosition = await this.database.get<Position | null>('eggPosition');

            this.egg.updatePosition(startPosition ?? { x: 20, y: 20 }, false);
        } catch (error) {
            this.handleError(error);
        }
    }

    private attachComponents() {
        this.errorContainer = new ErrorContainer().insert(this.root);
        // this.urlDatabaseShowcase = new UrlDatabaseShowcase(this.dataEncryptor, this.database).insert(this.root, {
        //     onError: (error: Error) => this.handleError(error),
        // });

        const databaseUpdateDebouncer = createDebouncer();
        this.egg = new Egg().insert(this.root, {
            position: { x: 10, y: 10 },
            onDrag: e => databaseUpdateDebouncer(() => this.database.set('eggPosition', this.egg.getPosition())),
        });

        const background = new Background().insert(this.root);
        this.dataDisplay = new DataDisplay().insert(background.getGameContainer());
    }

    public handleError(error: Error) {
        this.errorContainer.setError(error);
    }
}
