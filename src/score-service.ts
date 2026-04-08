import { UrlDatabase } from './database/url-database';

const SCORE_PER_PIXEL = 0.01;

/**
 * Encapsulates score mutations derived from gameplay actions.
 */
export class ScoreService {
    constructor(private readonly database: UrlDatabase) {}

    public getScoreForEggDrag(distance: number) {
        return Math.max(Math.floor(distance * this.getZoomFactor() * SCORE_PER_PIXEL), 1);
    }

    async resetScore() {
        await this.database.set<number>('score', 0);
    }

    private getZoomFactor() {
        return (window.outerWidth - 10) / window.innerWidth;
    }
}
