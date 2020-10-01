const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Express' });
});

router.get("/join", (req, res) => {
  res.render("join");
});

router.get("/profile", (req, res) => {
  res.render("profile");
});

module.exports = router;
