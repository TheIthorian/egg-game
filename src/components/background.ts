export class Background {
    private container: HTMLDivElement;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.backgroundColor = 'green';
        this.container.style.position = 'absolute';
        this.container.style.left = '0';
        this.container.style.top = '0';
        this.container.style.padding = '40px';

        this.container.innerHTML = `
        <div style='width: 100%; height: 100%; background-color: blue; display: flex; flex-direction: column; align-items: center; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px; border: solid 3px black'>
            <div style='width: 100%; background-color: yellow; display: flex; flex-direction: column; justify-content: space-around; height: 30px; padding: 4px; border-bottom: solid 3px black'>
                <div style='width: 100%; padding: 1px; background-color: black'></div>
                <div style='width: 100%; padding: 1px; background-color: black'></div>
                <div style='width: 100%; padding: 1px; background-color: black'></div>
                <div style='width: 100%; padding: 1px; background-color: black'></div>
            </div>
            <div style='padding: 30px; background-color: purple;'>
                <div style='display: flex; flex-direction: row; align-items: center; justify-items: center; font-family: monospace;'>  
                    <div><div>FEED EGGS</div></div>
                </div>
            </div>
        </div>
        `;

        this.container.style.zIndex = '-10';

        parent.appendChild(this.container);

        return this;
    }
}
