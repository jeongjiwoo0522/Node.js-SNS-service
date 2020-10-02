const express = require("express");
const multer = require("multer");
const path = require("path");
const { route } = require(".");

const { isLoggedIn, isNotLoggedIn } = require("./middleware");

const { Post, Hashtag, PostHashtag } = require("../models");
const { nextTick } = require("process");

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

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
    res.json({ url: `img/${req.file.filename}` });
});

const upload2 = multer();

router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
    const { content, url } = req.body;
    
    try {
        const post = await Post.create({
            content,
            img: url,
            UserId: req.user.id
        });

        const hashtags = content.match(/#[^\s#]+/g);
        if(hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    });
                })
            );

            await Promise.all(
                result.map(tag => {
                    return PostHashtag.create({
                        PostId: post.id,
                        HashtagId: tag[0].id,
                    });
                })
            );
        }
        res.redirect("/");
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;