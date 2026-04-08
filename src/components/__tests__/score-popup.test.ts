import { ScorePopup } from '../score-popup';

describe('ScorePopup', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('shows a popup when score crosses the next threshold from data updates', () => {
        jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0);

        const popup = new ScorePopup(15, 40).insert(document.body);
        const showEggCount = jest.spyOn(popup, 'showEggCount');

        popup.handleScoreChange(1, 10);
        expect(showEggCount).not.toHaveBeenCalled();

        popup.handleScoreChange(10, 24);
        expect(showEggCount).not.toHaveBeenCalled();

        popup.handleScoreChange(24, 25);
        expect(showEggCount).toHaveBeenCalledWith(2);
    });
});
