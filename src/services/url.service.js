const generateRandomHash = require("../utils/hash.util");
const URL = require("../models/url.model");
const AppError = require("../utils/errors");

class URLService {
    static async createShortUrl(originalUrl, alias, expiresAt) {
        let shortUrl = alias || generateRandomHash();
    
        const existingUrl = await URL.findOne({ shortUrl });
    
        if (existingUrl) {
            throw new AppError("Short URL already exists", 400);
        }
    
        const newUrl = new URL({
            originalUrl,
            shortUrl,
            expiresAt,
            clickCount: 0,
            analytics: []
        });
    
        await newUrl.save();
        return newUrl;
    }
    

    static async getOriginalUrl(shortUrl) {
        const url = await URL.findOne({ $or: [{ shortUrl }, { alias: shortUrl }] });

        if (!url) {
            throw new AppError("URL not found", 404);
        }

        return url;
    }

    static async incrementClickCount(shortUrl, ip) {
        const url = await URL.findOne({ shortUrl });

        if (!url) {
            throw new AppError("URL not found", 404);
        }

        url.clickCount += 1;
        url.analytics.push({ ip, accessedAt: new Date() });
        await url.save();
    }

    static async getAnalytics(shortUrl) {
        const url = await URL.findOne({ shortUrl });

        if (!url) {
            throw new AppError("URL not found", 404);
        }

        const recentAccesses = url.analytics
            .slice(-5)
            .map(entry => ({ ip: entry.ip, accessedAt: entry.accessedAt }));

        return {
            clickCount: url.clickCount,
            recentAccesses,
        };
    }

    // Удаление URL
    static async deleteUrl(shortUrl) {
        const deletedUrl = await URL.findOneAndDelete({ shortUrl });

        if (!deletedUrl) {
            throw new AppError("URL not found", 404);
        }

        return deletedUrl;
    }

    static async getAllUrls() {
        const urls = await URL.find().select("-analytics"); // Исключаем аналитические данные для упрощения
        return urls;
    }
}

module.exports = URLService;
