import { Position } from 'types';
import { STARTING_EGG_COUNT } from '../constants';
import { UrlDatabase } from '../database';

type NestOptions = {
    spawnEgg: (position: Position) => void;
    onNoEgg: () => void;
};

/**
 * Renders the egg source and reports where a new egg should spawn when clicked.
 */
export class Nest {
    private nestContainer: HTMLElement;
    private eggCountElement: HTMLDivElement;

    constructor(private readonly database: UrlDatabase, private readonly nestOptions: NestOptions) {}

    insert(parent: HTMLElement) {
        this.nestContainer = document.createElement('div');

        this.nestContainer.style.position = 'absolute';
        this.nestContainer.style.right = '100px';
        this.nestContainer.style.bottom = '150px';

        this.nestContainer.style.touchAction = 'none';

        this.nestContainer.innerHTML = `
        <image draggable=false src='Eggs.svg' alt='nest' style='object-fit: cover; width: 100%; height: 150px;' />
        <div id='egg-count' style='text-align: center; margin-top: 12px; font-size: 28px;'>EGGS:</div>
        `;

        this.eggCountElement = this.nestContainer.querySelector('#egg-count')!;

        parent.appendChild(this.nestContainer);

        this.nestContainer.addEventListener('pointerdown', async (e: PointerEvent) => {
            const eggCount = (await this.database.get<number>('eggCount')) ?? STARTING_EGG_COUNT;

            if (eggCount <= 0) {
                this.nestOptions.onNoEgg();
                return;
            }

            const newEggCount = eggCount - 1;
            await this.database.set('eggCount', newEggCount);
            this.nestOptions.spawnEgg({ x: e.clientX, y: e.clientY });
        });

        return this;
    }

    public setEggCount(eggCount: number) {
        this.eggCountElement.innerText = `EGGS: ${eggCount}`;
    }

    /**
     * Returns the nest's top-left screen position for distance calculations.
     */
    getPosition(): Position {
        const { x, y } = this.nestContainer.getBoundingClientRect();
        return { x, y };
    }
}
