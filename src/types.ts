export interface IUrlManager {
    getUrlState(): string | null;
    setUrlState(value: string): void;
}

export type Position = { x: number; y: number };
