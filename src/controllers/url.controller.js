const URLService = require("../services/url.service");
const AppError = require("../utils/errors");

class URLController {
    static async getAllLinks(req, res, next) {
        try {
            const urls = await URLService.getAllUrls();
            res.status(200).json(urls);
        } catch (error) {
            next(error);
        }
    }

    static async shortenUrl(req, res, next) {
        try {
            const { originalUrl, alias, expiresAt } = req.body;
            if (!originalUrl) {
                throw new AppError("Original URL is required", 400);
            }

            const url = await URLService.createShortUrl(originalUrl, alias, expiresAt);
            res.status(201).json({ shortUrl: url.shortUrl });
        } catch (error) {
            next(error);
        }
    }

    static async redirectToOriginal(req, res, next) {
        try {
            const { shortUrl } = req.params;
            const url = await URLService.getOriginalUrl(shortUrl);

            if (url.expiresAt && new Date() > url.expiresAt) {
                throw new AppError("URL expired", 410);
            }

            await URLService.incrementClickCount(shortUrl, req.ip);

            return res.redirect(url.originalUrl);
        } catch (error) {
            next(error);
        }
    }

    static async getAnalytics(req, res, next) {
        try {
            const { shortUrl } = req.params;
            const analytics = await URLService.getAnalytics(shortUrl);
            res.status(200).json(analytics);
        } catch (error) {
            next(error);
        }
    }

    static async getInfo(req, res, next) {
        try {
            const { shortUrl } = req.params;
            const url = await URLService.getOriginalUrl(shortUrl);
            res.status(200).json({
                originalUrl: url.originalUrl,
                createdAt: url.createdAt,
                clickCount: url.clickCount,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteUrl(req, res, next) {
        try {
            const { shortUrl } = req.params;
            const deletedUrl = await URLService.deleteUrl(shortUrl);
            res.status(200).json({ message: "URL deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = URLController;
