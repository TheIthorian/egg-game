import { UrlDatabase } from '../database/url-database';

const GAME_MODES = ['zen', 'story'] as const;
export type GameMode = (typeof GAME_MODES)[number];

/**
 * Renders the current game mode and toggles the persisted mode value when clicked.
 */
export class GameModeToggle {
    private container: HTMLDivElement;

    public static DEFAULT_GAME_MODE = 'story' as const;

    constructor(private readonly database: UrlDatabase) {}

    public async insert(parent: HTMLElement) {
        this.container = document.createElement('div');

        this.container.innerHTML = `<button>${await this.getButtonDisplayText()}</button>`;

        const buttonNode = this.container.childNodes[0];

        buttonNode.addEventListener('click', () => {
            this.toggleGameMode();
        });

        parent.appendChild(this.container);
        return this;
    }

    public setMode(gameMode: GameMode = GameModeToggle.DEFAULT_GAME_MODE) {
        this.container.querySelector('button').innerText = gameMode.toUpperCase();
    }

    /**
     * Returns the label shown on the button, defaulting to the fallback mode when none is stored.
     */
    public async getButtonDisplayText() {
        const gameMode = (await this.getCurrentGameMode()) ?? GameModeToggle.DEFAULT_GAME_MODE;
        return gameMode.toUpperCase();
    }

    private async getCurrentGameMode() {
        return this.database.get<GameMode>('gameMode');
    }

    public toggleGameMode() {
        console.log('Toggling game mode func');
        this.database.update<GameMode>('gameMode', oldGameMode => (oldGameMode === 'story' ? 'zen' : 'story'));
    }
}
