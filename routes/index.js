const express = require('express');
const router = express.Router();

const { isNotLoggedIn, isLoggedIn } = require("./middleware");
const { Post, User, Hashtag, PostHashtag } = require("../models");

/* GET home page. */

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"]
      },
      order: [["createdAt", "DESC"]],
    });
    res.render('main', { 
      title: 'Express',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if(!query){
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query }});

    let posts = [];

    if(hashtag) {
      const postIds = await PostHashtag.findAll({
        where: { HashtagId: hashtag.id },
        attributes: ["PostId"],
      });

      posts = await Promise.all(
        postIds.map(p => {
          return Post.findOne({ 
            where: { id: p.PostId },
            include: {
              model: User,
              attributes: ["id", "nick"],
            },
          });
        })
      );
    }

    res.render("main", {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch(err) {
    console.error(err);
    next(err);
  }
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird"});
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird"});
});

module.exports = router;
