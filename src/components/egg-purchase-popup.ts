const STYLE = { borderColor: '#1f2933', errorBorderColor: '#c62828', containerColor: '#ffffff' } as const;

type EggPurchasePopupOptions = {
    onPurchaseConfirmed: (eggCount: number) => Promise<void> | void;
};

export class EggPurchasePopup {
    protected container: HTMLDivElement;
    private panelElement: HTMLDivElement;
    private inputElement: HTMLInputElement;
    private messageElement: HTMLDivElement;
    private eggBasketPurchaseCount = 0;

    constructor(private readonly options: EggPurchasePopupOptions) {}

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';

        this.container.style.top = '40%';
        this.container.style.left = '50%';

        this.container.style.transform = 'translate(-50%, -50%)';

        this.container.style.width = 'min(720px, calc(100% - 48px))';
        this.container.style.display = 'none';

        this.container.style.zIndex = '60';

        this.container.innerHTML = `
        <div id='egg-purchase-popup-panel' style='width: 100%; background-color: ${STYLE.containerColor}; border: solid 4px ${STYLE.borderColor}; box-shadow: 0 0 0 2px ${STYLE.borderColor} inset;'>
            <div style='width: 100%; padding: 14px 14px 8px; box-sizing: border-box; border-bottom: solid 4px ${STYLE.borderColor};'>
                <div style='display: flex; flex-direction: column; gap: 4px;'>
                    <div style='width: 100%; height: 4px; background-color: ${STYLE.borderColor};'></div>
                    <div style='width: 100%; height: 4px; background-color: ${STYLE.borderColor};'></div>
                    <div style='width: 100%; height: 4px; background-color: ${STYLE.borderColor};'></div>
                    <div style='width: 100%; height: 4px; background-color: ${STYLE.borderColor};'></div>
                </div>
            </div>
            <div style='padding: 56px 48px 88px; box-sizing: border-box;'>
                <div id='egg-purchase-popup-message' style='text-align: center; font-size: 40px; line-height: 1.35; letter-spacing: 1px;'>
                    Dude, you ran out of eggs.<br />
                    Would you like to buy<br />
                    an 0 pack of eggs?
                </div>
                <input
                    id='egg-purchase-popup-input'
                    type='text'
                    autocomplete='off'
                    spellcheck='false'
                    style='display: block; width: min(840px, 100%); max-width: 100%; height: 92px; margin: 92px auto 0; border: solid 4px ${STYLE.borderColor}; box-sizing: border-box; font-size: 36px; text-align: center; text-transform: uppercase; outline: none;'
                />
            </div>
        </div>
        `;

        this.panelElement = this.container.querySelector('#egg-purchase-popup-panel')!;
        this.inputElement = this.container.querySelector('#egg-purchase-popup-input')!;
        this.messageElement = this.container.querySelector('#egg-purchase-popup-message')!;

        this.inputElement.addEventListener('input', () => void this.handleInputChange());

        parent.appendChild(this.container);

        return this;
    }

    public show(eggCount: number) {
        if (this.isVisible()) return;

        this.eggBasketPurchaseCount = eggCount;
        this.messageElement.innerHTML = `
                    Dude, you ran out of eggs.<br />
                    Would you like to buy<br />
                    an ${eggCount} pack of eggs?
                `;
        this.resetInputs();
        this.container.style.display = 'block';
        this.inputElement.focus();
    }

    public hide() {
        this.container.style.display = 'none';
        this.resetInputs();
    }

    private async handleInputChange() {
        const value = this.inputElement.value.trim();

        if (value === 'YES') {
            this.clearError();
            await this.options.onPurchaseConfirmed(this.eggBasketPurchaseCount);
            this.hide();
            return;
        }

        if (value.length === 0 || 'YES'.startsWith(value)) {
            this.clearError();
            return;
        }

        this.showError();
    }

    private resetInputs() {
        this.inputElement.value = '';
        this.clearError();
    }

    private showError() {
        this.panelElement.style.borderColor = STYLE.errorBorderColor;
    }

    private clearError() {
        this.panelElement.style.borderColor = STYLE.borderColor;
    }

    private isVisible() {
        return this.container.style.display !== 'none';
    }
}
