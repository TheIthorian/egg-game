import { Position } from 'types';

type NestOptions = {
    spawnEgg: (position: Position) => void;
};

export class Nest {
    private nestContainer: HTMLElement;

    constructor(private readonly nestOptions: NestOptions) {}

    insert(parent: HTMLElement) {
        this.nestContainer = document.createElement('div');

        this.nestContainer.innerHTML = `
        <image draggable=false src='Eggs.svg' alt='nest' style='object-fit: cover; width: 100%; height: 150px;' />
        `;
        this.nestContainer.style.position = 'absolute';
        this.nestContainer.style.right = '100px';
        this.nestContainer.style.bottom = '150px';

        parent.appendChild(this.nestContainer);

        this.nestContainer.addEventListener('mousedown', (e: MouseEvent) =>
            this.nestOptions.spawnEgg({ x: e.x, y: e.y })
        );

        return this;
    }

    getPosition(): Position {
        const { x, y } = this.nestContainer.getBoundingClientRect();
        return { x, y };
    }
}
