import { DataEncryptor } from './encryption/types';
import { SimpleEncryptor } from './encryption';
import { UrlDatabase, UrlManager } from './database';
import { config } from './config';
import { DataPublisher } from './database/data-publisher';
import { Position } from './types';
import { createDebouncer } from './debouncer';
import { registerHotkeys } from './hotkey';
import { ScoreService } from './score-service';
import { MAX_SCORE_POPUP_DELTA, MIN_SCORE_POPUP_DELTA, STARTING_EGG_COUNT, STORE_EGG_COUNT } from './constants';

import {
    ErrorContainer,
    Egg,
    EggPurchasePopup,
    DataDisplay,
    Background,
    Nest,
    Mouth,
    ResetScoreButton,
    ScoreDisplay,
    ScorePopup,
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

    private egg: Egg;
    private nest: Nest;
    private mouth: Mouth;
    private dataDisplay: DataDisplay;
    private scoreDisplay: ScoreDisplay;
    private scorePopup: ScorePopup;
    private eggPurchasePopup: EggPurchasePopup;
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
            await this.publishInitialState();
        } catch (error) {
            this.handleError(error);
        }
    }

    private async attachComponents() {
        const databaseUpdateDebouncer = createDebouncer();
        const onDrag = () => databaseUpdateDebouncer(() => this.database.set('eggPosition', this.egg.getPosition()));
        const onDrop = (e: PointerEvent) => this.handleDropEgg(e);

        this.errorContainer = new ErrorContainer(() => {
            this.database.drop();
            window.location.reload();
        }).insert(this.root);

        this.nest = new Nest(this.database, {
            onNoEgg: () => this.eggPurchasePopup.show(STORE_EGG_COUNT),
            spawnEgg: async (position: Position) => {
                // There's already an egg in play
                if ((await this.database.get('hasEgg')) && this.egg) return;

                this.egg = new Egg().insert(this.root, { position, onDrag, onDrop, isDragging: true });

                await this.database.set('hasEgg', true);
                await this.database.set('eggPosition', this.egg.getPosition());
            },
        }).insert(this.root);

        const background = new Background().insert(this.root);
        this.dataDisplay = new DataDisplay().insert(background.getGameContainer());
        this.mouth = new Mouth().insert(this.root);

        const uiControls = new UIControls().insert(this.root);

        new ResetScoreButton(this.scoreService).insert(uiControls.getDomElement());

        this.scoreDisplay = new ScoreDisplay().insert(this.root);
        this.scorePopup = new ScorePopup(MIN_SCORE_POPUP_DELTA, MAX_SCORE_POPUP_DELTA).insert(this.root);

        this.eggPurchasePopup = new EggPurchasePopup({
            onPurchaseConfirmed: async eggCount => await this.database.set<number>('eggCount', eggCount),
        }).insert(this.root);

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

        window.addEventListener('dataChange', ((
            e: CustomEvent<{ data: Record<string, unknown>; previousData: Record<string, unknown> }>
        ) => {
            const data = e.detail.data;
            const previousData = e.detail.previousData;
            const score = <number>data.score ?? 0;
            const previousScore = <number>previousData.score ?? 0;
            const eggCount = <number>data.eggCount ?? STARTING_EGG_COUNT;

            this.nest.setEggCount(eggCount);
            this.dataDisplay.setData(data);
            this.scoreDisplay.setScore(score);
            this.scorePopup.handleScoreChange(previousScore, score);
            this.gameModeToggle.setMode(<GameMode>data.gameMode);
        }) as EventListener);
    }

    private async handleDropEgg(event: PointerEvent) {
        if (!this.mouth.isWithinBounds({ x: event.clientX, y: event.clientY })) return;

        const distanceBetween = distance(this.mouth.getPosition(), this.nest.getPosition());
        const data = await this.database.getAll();
        const score = <number>data.score ?? 0;
        const eggsEaten = <number>data.eggsEaten ?? 0;

        await this.database.setAll({
            ...data,
            score: score + this.scoreService.getScoreForEggDrag(distanceBetween),
            hasEgg: false,
            eggsEaten: eggsEaten + 1,
        });

        this.egg.delete();
    }

    private async publishInitialState() {
        const data = await this.database.getAll();
        const nextData = { ...data, eggCount: data.eggCount ?? STARTING_EGG_COUNT, eggsEaten: data.eggsEaten ?? 0 };
        await this.database.setAll(nextData);
        this.dataPublisher.publish(data);
    }

    /**
     * Routes runtime errors to the shared error display.
     */
    public handleError(error: Error) {
        this.errorContainer.setError(error);
    }
}
