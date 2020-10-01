const express = require("express");
const multer = require("multer");
const path = require("path");

const { isLoggedIn, isNotLoggedIn } = require("./middleware");

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post("/post", isLoggedIn, upload.single(""));

module.exports = router;