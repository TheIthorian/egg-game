import { ScoreService } from '../score-service';

export class ResetScore {
    private container: HTMLDivElement;

    constructor(private readonly scoreService: ScoreService) {}

    public insert(parent: HTMLElement) {
        this.container = document.createElement('div');
        this.container.innerHTML = '<button>RESET SCORE</button>';
        this.container.childNodes[0].addEventListener('click', () => {
            this.resetScore();
        });
        parent.appendChild(this.container);
        return this;
    }

    public resetScore() {
        this.scoreService.resetScore();
    }
}
