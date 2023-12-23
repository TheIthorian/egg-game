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
        <div>Egg</div>
        `;
        this.eggContainer.style.position = 'absolute';
        this.eggContainer.style.padding = '10px';
        this.eggContainer.style.backgroundColor = 'red';
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

    updatePosition({ x, y }: Position) {
        this.eggContainer.style.left = numberToPx(x - this.eggContainer.clientWidth / 2);
        this.eggContainer.style.top = numberToPx(y - this.eggContainer.clientHeight / 2);
    }
}

function numberToPx(n: number) {
    return n.toString() + 'px';
}
