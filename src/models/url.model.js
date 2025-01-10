const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, unique: true, required: true, maxlength: 20 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    clickCount: { type: Number, default: 0 },
    analytics: { type: [{ ip: String, accessedAt: Date }], default: [] },
});

module.exports = mongoose.model("URL", urlSchema);
