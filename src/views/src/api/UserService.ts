import api from ".";
import { Link } from "../types/link";

class UrlService {
    // Создание короткой ссылки
    async createShortUrl(originalUrl: string, alias?: string, expiresAt?: string): Promise<Link> {
        const response = await api.post<Link>("/shorten", { originalUrl, alias, expiresAt });
        return response.data;
    }

    // Получение списка всех ссылок
    async getLinks(): Promise<Link[]> {
        const response = await api.get<Link[]>("/links");
        return response.data;
    }
}

export const urlService = new UrlService();
