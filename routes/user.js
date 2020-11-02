const express = require("express");

const { isLoggedIn } = require("./middleware");
const { addFollowing } = require("../controller/user");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, addFollowing);

module.exports = router;