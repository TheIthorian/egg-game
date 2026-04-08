import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { UrlDatabase, UrlManager } from './database';
import { config } from './config';
import { DataPublisher } from './database/data-publisher';
import { Position } from './types';
import { createDebouncer } from './debouncer';
import { registerHotkeys } from './hotkey';
import { ScoreService } from './score-service';

import {
    ErrorContainer,
    UrlDatabaseShowcase,
    Egg,
    DataDisplay,
    Background,
    Nest,
    Mouth,
    ResetScore,
    ScoreDisplay,
    GameModeToggle,
    UIControls,
} from './components';
import { distance } from './util';
import { GameMode } from 'components/game-mode-toggle';

/**
 * Composes the game runtime, wires shared services together, and coordinates UI updates.
 */
export class App {
    private errorContainer: ErrorContainer;
    private urlDatabaseShowcase: UrlDatabaseShowcase;
    private egg: Egg;
    private nest: Nest;
    private mouth: Mouth;
    private dataDisplay: DataDisplay;
    private scoreDisplay: ScoreDisplay;
    private gameModeToggle: GameModeToggle;

    constructor(
        private readonly root: HTMLElement,
        private readonly dataEncryptor: DataEncryptor,
        private readonly database: UrlDatabase,
        private readonly scoreService: ScoreService,
        private readonly dataPublisher: DataPublisher
    ) {}

    public static newInstance(root: HTMLElement) {
        const encryptor = new SimpleEncryptor(config.encryptionKey);
        const dataPublisher = new DataPublisher();
        const urlDatabase = new UrlDatabase(encryptor, '123', new UrlManager(), dataPublisher);
        const scoreService = new ScoreService(urlDatabase);
        return new App(root, encryptor, urlDatabase, scoreService, dataPublisher);
    }

    /**
     * Boots the application, attaches the UI, and publishes the initial persisted state.
     */
    public async main() {
        try {
            await this.attachComponents();
            this.dataPublisher.publish(await this.database.getAll());
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

        const uiControls = new UIControls().insert(this.root);

        new ResetScore(this.scoreService).insert(uiControls.getDomElement());
        this.scoreDisplay = new ScoreDisplay().insert(this.root);

        this.gameModeToggle = await new GameModeToggle(this.database).insert(uiControls.getDomElement());

        if (await this.database.get('hasEgg')) {
            this.egg = new Egg().insert(this.root, {
                position: await this.database.get('eggPosition'),
                onDrag,
                onDrop,
            });
        }

        registerHotkeys({
            d: () => this.dataDisplay.toggleDisplay(),
            r: () => this.scoreService.resetScore(),
        });

        window.addEventListener('dataChange', ((e: CustomEvent<{ data: Record<string, unknown> }>) => {
            const data = e.detail.data as Record<string, unknown>;
            this.dataDisplay.setData(data);
            this.scoreDisplay.setScore(<number>data.score ?? 0);
            this.gameModeToggle.setMode(<GameMode>data.gameMode);
        }) as EventListener);
    }

    private async handleDropEgg(event: MouseEvent) {
        if (!this.mouth.isWithinBounds({ x: event.clientX, y: event.clientY })) return;

        const distanceBetween = distance(this.mouth.getPosition(), this.nest.getPosition());
        await Promise.all([
            this.scoreService.increaseScoreForEggDrag(distanceBetween),
            this.database.set('hasEgg', false),
        ]);
        this.egg.delete();
    }

    /**
     * Routes runtime errors to the shared error display.
     */
    public handleError(error: Error) {
        this.errorContainer.setError(error);
    }
}
