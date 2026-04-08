import { Position } from '../types';

type PointerEventHandler = (event: PointerEvent) => void;

type EggProps = { position: Position; onDrag: PointerEventHandler; onDrop: PointerEventHandler; isDragging?: boolean };

/**
 * Draggable game object that tracks its on-screen position and drag lifecycle.
 */
export class Egg {
    private eggContainer: HTMLDivElement;
    isDragging = false;
    onDrag: PointerEventHandler;
    onDrop: PointerEventHandler;

    insert(parent: HTMLElement, { position, onDrag, isDragging, onDrop }: EggProps) {
        this.onDrag = onDrag;
        this.onDrop = onDrop;
        this.isDragging = isDragging ?? false;

        this.eggContainer = document.createElement('div');
        this.eggContainer.innerHTML = `
        <image draggable=false src='Egg.svg' alt='egg' style='object-fit: cover; width: 100%; height: 70px;' />
        `;
        this.eggContainer.style.position = 'absolute';
        this.eggContainer.style.padding = '10px'; // To prevent dropping the egg
        this.eggContainer.style.cursor = 'pointer';
        this.eggContainer.style.touchAction = 'none';

        this.eggContainer.addEventListener('pointerdown', event => {
            this.eggContainer.setPointerCapture(event.pointerId);
            this.isDragging = true;
        });

        document.addEventListener('pointermove', event => {
            if (!this.isDragging) return;

            this.updatePosition({ x: event.clientX, y: event.clientY });
            onDrag(event);
        });

        const finishDrag = (event: PointerEvent) => {
            if (!this.isDragging) return;

            this.onDrop(event);
            this.isDragging = false;
        };

        document.addEventListener('pointerup', finishDrag);
        document.addEventListener('pointercancel', finishDrag);

        parent.appendChild(this.eggContainer);

        setTimeout(() => this.updatePosition(position), 100);

        return this;
    }

    /**
     * Moves the egg to a screen position, optionally centering it on the supplied coordinates.
     */
    updatePosition({ x, y }: Position, offset = true) {
        this.eggContainer.style.left = numberToPx(x - (offset ? this.eggContainer.clientWidth / 2 : 0));
        this.eggContainer.style.top = numberToPx(y - (offset ? this.eggContainer.clientHeight / 2 : 0));
    }

    getPosition(): Position {
        const rect = this.eggContainer.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    }

    /**
     * Removes the egg from the DOM
     */
    delete(): void {
        this.eggContainer.remove();
    }
}

function numberToPx(n: number) {
    return n.toString() + 'px';
}
