export class ScoreDisplay {
    private container: HTMLDivElement;
    private score: number;

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        parent.appendChild(this.container);

        this.setScore(0);

        return this;
    }

    public setScore(score: number) {
        this.score = score;
        this.container.innerHTML = `<pre style='position: absolute; right: 50px; top: 70px'>${this.getDisplayText()}</pre>`;
    }

    private getDisplayText() {
        return `SCORE: ${this.score}`;
    }
}
