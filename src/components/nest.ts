export class Nest {
    private nestContainer: HTMLElement;

    insert(parent: HTMLElement) {
        this.nestContainer = document.createElement('div');

        this.nestContainer.innerHTML = `
        <image draggable=false src='Eggs.svg' alt='egg' style='object-fit: cover; width: 100%; height: 150px;' />
        `;
        this.nestContainer.style.position = 'absolute';
        this.nestContainer.style.right = '100px';
        this.nestContainer.style.bottom = '150px';

        parent.appendChild(this.nestContainer);
        return this;
    }
}
