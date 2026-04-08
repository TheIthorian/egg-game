import { UrlDatabase } from './database/url-database';

const SCORE_PER_PIXEL = 0.01;

/**
 * Encapsulates score mutations derived from gameplay actions.
 */
export class ScoreService {
    constructor(private readonly database: UrlDatabase) {}

    /**
     * Converts drag distance into score, accounting for browser zoom so the result feels consistent.
     */
    async increaseScoreForEggDrag(distance: number) {
        const scored = Math.max(Math.floor(distance * this.getZoomFactor() * SCORE_PER_PIXEL), 1);
        await this.database.update<number>('score', (score = 0) => score + scored);
    }

    async resetScore() {
        await this.database.set<number>('score', 0);
    }

    private getZoomFactor() {
        return (window.outerWidth - 10) / window.innerWidth;
    }
}
