export interface Link {
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    clickCount: number;
    expiresAt?: string
}