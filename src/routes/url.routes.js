const express = require("express");
const URLController = require("../controllers/url.controller");

const router = express.Router();

router.post("/shorten", URLController.shortenUrl);
router.get("/analytics/:shortUrl", URLController.getAnalytics);
router.get("/info/:shortUrl", URLController.getInfo);
router.delete("/delete/:shortUrl", URLController.deleteUrl);
router.get("/links", URLController.getAllLinks);
router.get("/:shortUrl", URLController.redirectToOriginal);

module.exports = router;
