const express = require("express");
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const { isLoggedIn } = require("./middleware");

const { Post, Hashtag, PostHashtag } = require("../models");

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
});

const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: "ddyzd",
        key(req, file, cb) {
            cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    res.json({ url: req.file.location });
});

const upload2 = multer();

router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
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