import { EggCountPopup } from '../egg-count-popup';

describe('EggCountPopup', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('shows the remaining egg count in the popup message', () => {
        const popup = new EggCountPopup().insert(document.body);

        popup.show(40);

        expect(document.body.textContent).toContain('You now have 40 eggs.');
    });
});
