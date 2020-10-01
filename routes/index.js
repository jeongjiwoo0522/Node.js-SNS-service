const express = require('express');
const router = express.Router();

/* GET home page. */

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', (req, res, next) => {
  res.render('main', { title: 'Express' });
});

router.get("/join", (req, res) => {
  res.render("join", { title: "내 정보 - NodeBird"});
});

router.get("/profile", (req, res) => {
  res.render("profile", { title: "회원가입 - NodeBird"});
});

router.post("/post", (req, res) => {
  
});

module.exports = router;
