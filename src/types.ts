export interface IUrlManager {
    getUrlState(): string | null;
    setUrlState(value: string): void;
}
