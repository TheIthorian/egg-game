const STYLE = { borderColor: '#1f2933', containerColor: '#ffffff' } as const;

export class EggCountPopup {
    protected container: HTMLDivElement;
    private messageElement: HTMLDivElement;
    private showTimeoutId: string;
    private hideEventListener = () => this.hide();

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '40%';
        this.container.style.left = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.width = 'min(560px, calc(100% - 48px))';
        this.container.style.display = 'none';
        this.container.style.zIndex = '55';
        this.container.style.pointerEvents = 'none';
        this.container.innerHTML = `
        <div style='width: 100%; background-color: ${STYLE.containerColor}; border: solid 3px ${STYLE.borderColor}; box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15)'>
            <div style='width: 100%; padding: 10px 10px 6px; box-sizing: border-box; border-bottom: solid 3px ${STYLE.borderColor};'>
                <div style='display: flex; flex-direction: column; gap: 4px;'>
                    <div style='width: 100%; height: 3px; background-color: ${STYLE.borderColor};'></div>
                    <div style='width: 100%; height: 3px; background-color: ${STYLE.borderColor};'></div>
                    <div style='width: 100%; height: 3px; background-color: ${STYLE.borderColor};'></div>
                    <div style='width: 100%; height: 3px; background-color: ${STYLE.borderColor};'></div>
                </div>
            </div>
            <div id='egg-count-popup-message' style='min-height: 148px; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 28px; line-height: 1.35; letter-spacing: 1px;'>
            </div>
        </div>
        `;

        this.messageElement = this.container.querySelector('#egg-count-popup-message')!;

        parent.appendChild(this.container);

        return this;
    }

    public show(eggCount: number) {
        this.messageElement.textContent = `You now have ${eggCount} eggs.`;
        this.container.style.display = 'block';

        this.showTimeoutId = setTimeout(() =>
            document.addEventListener('click', this.hideEventListener.bind(this))
        ) as unknown as string;
    }

    public hide() {
        this.container.style.display = 'none';
        clearTimeout(this.showTimeoutId);
        document.removeEventListener('click', this.hideEventListener.bind(this));
    }
}
