import { UrlDatabase } from './database/url-database';

const SCORE_PER_PIXEL = 0.01;

export class ScoreService {
    constructor(private readonly database: UrlDatabase) {}

    async increaseScoreForEggDrag(distance: number) {
        const scored = Math.max(Math.floor(distance * this.getZoomFactor() * SCORE_PER_PIXEL), 1);
        await this.database.update<number>('score', (score = 0) => score + scored);
    }

    private getZoomFactor() {
        return (window.outerWidth - 10) / window.innerWidth;
    }
}
