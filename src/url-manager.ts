import { IUrlManager } from './types';

export class UrlManager implements IUrlManager {
    public getUrlState(): string | null {
        return new URL(window.location.href).searchParams.get('state');
    }

    public setUrlState(value: string) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('state', value);
        history.replaceState(null, '', currentUrl);
    }
}
