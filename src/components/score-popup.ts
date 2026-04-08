const STYLE = { borderColor: 'black', containerColor: '#ffffff' } as const;

/**
 * Presents a modal which tells the user (inaccurately) how many eggs they have moved
 */
export class ScorePopup {
    protected container: HTMLDivElement;
    private messageElement: HTMLDivElement;
    private showTimeoutId: string;
    private hideEventListener = () => this.hideEggCount();

    /** The score is not reset so carry over the previous threshold */
    private previousPopupTriggerAmount: number = null;

    /** The score increase needed to trigger the popup */
    private nextScorePopupTriggerAmount: number = null;

    constructor(private readonly minScorePopupDelta: number, private readonly maxScorePopupDelta: number) {}

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';

        this.container.style.top = '40%';
        this.container.style.left = '50%';

        this.container.style.transform = 'translateX(-50%)';
        this.container.style.width = 'min(560px, calc(100% - 48px))';

        this.container.style.display = 'none';
        this.container.style.zIndex = '50';
        this.container.style.pointerEvents = 'none';

        this.container.innerHTML = `
        <div style='width: 100%; background-color: ${STYLE.containerColor}; border: solid 3px ${STYLE.borderColor}; box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15)'>
            <div style='width: 100%; background-color: ${STYLE.containerColor}; display: flex; flex-direction: column; justify-content: space-around; height: 28px; padding: 4px; border-bottom: solid 3px ${STYLE.borderColor}'>
                <div style='width: 100%; padding: 1px; background-color: ${STYLE.borderColor}'></div>
                <div style='width: 100%; padding: 1px; background-color: ${STYLE.borderColor}'></div>
                <div style='width: 100%; padding: 1px; background-color: ${STYLE.borderColor}'></div>
                <div style='width: 100%; padding: 1px; background-color: ${STYLE.borderColor}'></div>
            </div>
            <div id='score-popup-message' style='min-height: 128px; display: flex; align-items: center; justify-content: center; font-size: 40px; letter-spacing: 2px; text-transform: uppercase;'>
            </div>
        </div>
        `;

        this.messageElement = this.container.querySelector('#score-popup-message')!;

        parent.appendChild(this.container);

        return this;
    }

    public handleScoreChange(previousScore: number, currentScore: number) {
        if (!previousScore || previousScore == currentScore) return;

        console.log({ previousScore, currentScore });

        // We may be loading old state so let's restart the counter
        if (!this.previousPopupTriggerAmount || !this.nextScorePopupTriggerAmount) {
            this.previousPopupTriggerAmount = currentScore;
            this.nextScorePopupTriggerAmount = currentScore + this.getRandomScorePopupDelta();
            return;
        }

        // Check if we have gained enough score to trigger the popup
        if (currentScore >= this.nextScorePopupTriggerAmount) {
            this.showEggCount(this.getRandomEggCount());
            this.previousPopupTriggerAmount = this.nextScorePopupTriggerAmount;
            this.nextScorePopupTriggerAmount = currentScore + this.getRandomScorePopupDelta();
        }
    }

    public showEggCount(count: number) {
        this.messageElement.innerText = `${count} eggs`;
        this.container.style.display = 'block';
        this.showTimeoutId = setTimeout(() =>
            document.addEventListener('click', this.hideEventListener)
        ) as unknown as string;
    }

    public hideEggCount() {
        this.container.style.display = 'none';
        clearTimeout(this.showTimeoutId);
        document.removeEventListener('click', this.hideEventListener);
    }

    private getRandomEggCount() {
        return Math.floor(Math.random() * 28) + 2;
    }

    private getRandomScorePopupDelta() {
        return (
            Math.floor(Math.random() * (this.maxScorePopupDelta - this.minScorePopupDelta + 1)) +
            this.minScorePopupDelta
        );
    }
}
