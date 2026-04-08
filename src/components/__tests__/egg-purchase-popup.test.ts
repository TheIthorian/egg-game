import { EggPurchasePopup } from '../egg-purchase-popup';

describe('EggPurchasePopup', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('restocks eggs when the user types YES', async () => {
        const onPurchaseConfirmed = jest.fn().mockResolvedValue(undefined);
        const popup = new EggPurchasePopup({ onPurchaseConfirmed }).insert(document.body);

        popup.show(80);

        const input = document.body.querySelector('#egg-purchase-popup-input') as HTMLInputElement;
        input.value = 'YES';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        await Promise.resolve();

        expect(onPurchaseConfirmed).toHaveBeenCalledTimes(1);
        expect(onPurchaseConfirmed).toHaveBeenCalledWith(80);
        expect((document.body.firstElementChild as HTMLElement).style.display).toBe('none');
    });

    it('shows a red border when the user types anything else', () => {
        const popup = new EggPurchasePopup({ onPurchaseConfirmed: jest.fn() }).insert(document.body);

        popup.show(80);

        const input = document.body.querySelector('#egg-purchase-popup-input') as HTMLInputElement;
        const panel = document.body.querySelector('#egg-purchase-popup-panel') as HTMLDivElement;

        input.value = 'NO';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(panel.style.borderColor).toBe('#c62828');
    });
});
