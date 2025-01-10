const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../src/app");
const URL = require("../src/models/url.model");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("URL Shortener API", () => {
    test("should create a short URL with alias", async () => {
        const response = await request(app)
            .post("/api/shorten")
            .send({
                originalUrl: "https://example.com",
                alias: "exampleAlias",
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.shortUrl).toBeDefined();

        const url = await URL.findOne({ shortUrl: "exampleAlias" });
        expect(url).not.toBeNull();
        expect(url.originalUrl).toBe("https://example.com");
    });

    test("should create a short URL without alias", async () => {
        const response = await request(app)
            .post("/api/shorten")
            .send({
                originalUrl: "https://example.com",
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.shortUrl).toBeDefined();

        const url = await URL.findOne({ shortUrl: response.body.shortUrl });
        expect(url).not.toBeNull();
        expect(url.originalUrl).toBe("https://example.com");
    });

    test("should return validation error for alias longer than 20 characters", async () => {
        const response = await request(app)
            .post("/api/shorten")
            .send({
                originalUrl: "https://example.com",
                alias: "thisaliasiswaytoolongtofit",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation error");
    });

    test("should return analytics for a short URL", async () => {
        const newUrl = new URL({
            originalUrl: "https://example.com",
            shortUrl: "short123",
            clickCount: 5,
            analytics: [{ ip: "127.0.0.1", accessedAt: new Date() }],
        });
        await newUrl.save();

        const response = await request(app).get("/api/analytics/short123");

        expect(response.statusCode).toBe(200);
        expect(response.body.clickCount).toBe(5);
        expect(response.body.recentAccesses.length).toBe(1);
    });

    test("should redirect to the original URL", async () => {
        const newUrl = new URL({
            originalUrl: "https://example.com",
            shortUrl: "short123",
        });
        await newUrl.save();

        const response = await request(app).get("/api/short123");

        expect(response.statusCode).toBe(302);
        expect(response.header.location).toBe("https://example.com");
    });

    test("should delete a short URL", async () => {
        const newUrl = new URL({
            originalUrl: "https://example.com",
            shortUrl: "short123",
        });
        await newUrl.save();

        const url = await URL.findOne({ shortUrl: "short123" });
        expect(url.shortUrl).toBe("short123");;

        const response = await request(app).delete("/api/delete/short123");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("URL deleted successfully");

        const deleteurl = await URL.findOne({ shortUrl: "short123" });
        expect(deleteurl).toBeNull();
    });

    test("should return 404 for non-existing short URL", async () => {
        const response = await request(app).get("/api/analytics/nonExisting");

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("URL not found");
    });
});
