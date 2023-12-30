import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { UrlDatabase, UrlManager } from './database';
import { config } from './config';
import { DataPublisher } from './database/data-publisher';
import { Position } from './types';
import { createDebouncer } from './debouncer';
import { registerHotkeys } from './hotkey';

import {
    ErrorContainer,
    UrlDatabaseShowcase,
    Egg,
    DataDisplay,
    Background,
    Nest,
    Mouth,
    ResetScore,
} from './components';
import { distance } from './util';

export class App {
    private errorContainer: ErrorContainer;
    private urlDatabaseShowcase: UrlDatabaseShowcase;
    private egg: Egg;
    private nest: Nest;
    private mouth: Mouth;
    private dataDisplay: DataDisplay;

    constructor(
        private readonly root: HTMLElement,
        private readonly dataEncryptor: DataEncryptor,
        private readonly database: UrlDatabase
    ) {}

    public static newInstance(root: HTMLElement) {
        const encryptor = new SimpleEncryptor(config.encryptionKey);
        const dataPublisher = new DataPublisher();
        const urlDatabase = new UrlDatabase(encryptor, '123', new UrlManager(), dataPublisher);
        return new App(root, encryptor, urlDatabase);
    }

    public async main() {
        try {
            await this.attachComponents();
            this.dataDisplay.setData(await this.database.getAll());
        } catch (error) {
            this.handleError(error);
        }
    }

    private async attachComponents() {
        const databaseUpdateDebouncer = createDebouncer();
        const onDrag = () => databaseUpdateDebouncer(() => this.database.set('eggPosition', this.egg.getPosition()));
        const onDrop = (e: MouseEvent) => this.handleDropEgg(e);

        this.errorContainer = new ErrorContainer().insert(this.root);

        this.nest = new Nest({
            spawnEgg: async (position: Position) => {
                if ((await this.database.get('hasEgg')) && this.egg) return;

                this.egg = new Egg().insert(this.root, {
                    position,
                    onDrag,
                    onDrop,
                    isDragging: true,
                });
                await this.database.set('hasEgg', true);
                await this.database.set('eggPosition', this.egg.getPosition());
            },
        }).insert(this.root);

        const background = new Background().insert(this.root);
        this.dataDisplay = new DataDisplay().insert(background.getGameContainer());
        this.mouth = new Mouth().insert(this.root);

        new ResetScore(this.database).insert(this.root);

        if (await this.database.get('hasEgg')) {
            this.egg = new Egg().insert(this.root, {
                position: await this.database.get('eggPosition'),
                onDrag,
                onDrop,
            });
        }

        registerHotkeys({
            d: () => this.dataDisplay.toggleDisplay(),
        });

        window.addEventListener('dataChange', ((e: CustomEvent<{ data: Record<string, unknown> }>) => {
            const data = e.detail.data as Record<string, unknown>;
            this.dataDisplay.setData(data);
        }) as EventListener);
    }

    private async handleDropEgg(event: MouseEvent) {
        if (!this.mouth.isWithinBounds({ x: event.clientX, y: event.clientY })) return;

        const distanceBetween = distance(this.mouth.getPosition(), this.nest.getPosition());
        const scored = Math.max(Math.floor(distanceBetween / 100), 1);

        await Promise.all([
            this.database.update<number>('score', score => score + scored),
            this.database.set('hasEgg', false),
        ]);
        this.egg.delete();
    }

    public handleError(error: Error) {
        this.errorContainer.setError(error);
    }
}
