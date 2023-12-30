import { Position } from '../types';

export class Mouth {
    private container: HTMLDivElement;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.innerHTML = '<span>MOUTH</span>';

        this.container.innerHTML = `
        <image draggable=false src='Mouth.svg' alt='mouth' style='object-fit: cover; width: 100%; height: 150px;' />
        `;
        this.container.style.position = 'absolute';
        this.container.style.padding = '10px';
        this.container.style.backgroundColor = 'red';
        this.container.style.left = '100px';
        this.container.style.bottom = '150px';

        parent.appendChild(this.container);
        return this;
    }

    public isWithinBounds({ x, y }: Position) {
        const rect = this.container.getBoundingClientRect();

        console.log('Checking if ', { x, y }, 'is within', rect);

        return rect.left < x && rect.right > x && rect.top < y && rect.bottom > y;
    }

    public getPosition(): Position {
        const { x, y } = this.container.getBoundingClientRect();
        return { x, y };
    }
}
