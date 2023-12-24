import { Position } from '../types';

type DragEventHandler = (event: MouseEvent) => void;

type EggProps = { position: Position; onDrag: DragEventHandler };

export class Egg {
    eggContainer: HTMLDivElement;
    isDragging = false;
    onDrag: DragEventHandler;

    insert(parent: HTMLElement, { position, onDrag }: EggProps) {
        this.onDrag = onDrag;

        this.eggContainer = document.createElement('div');
        this.eggContainer.innerHTML = `
        <image draggable=false src='Egg.svg' alt='egg' style='object-fit: cover; width: 100%; height: 70px;' />
        `;
        this.eggContainer.style.position = 'absolute';
        this.eggContainer.style.padding = '10px'; // To prevent dropping the egg
        this.eggContainer.style.cursor = 'pointer';

        this.eggContainer.addEventListener('mousedown', () => {
            this.isDragging = true;
        });

        document.addEventListener('mousemove', event => {
            if (!this.isDragging) return;

            this.updatePosition({ x: event.x, y: event.y });
            onDrag(event);
        });

        this.eggContainer.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.updatePosition(position);

        parent.appendChild(this.eggContainer);

        return this;
    }

    updatePosition({ x, y }: Position, offset = true) {
        this.eggContainer.style.left = numberToPx(x - (offset ? this.eggContainer.clientWidth / 2 : 0));
        this.eggContainer.style.top = numberToPx(y - (offset ? this.eggContainer.clientHeight / 2 : 0));
    }

    getPosition(): Position {
        const rect = this.eggContainer.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    }
}

function numberToPx(n: number) {
    return n.toString() + 'px';
}
