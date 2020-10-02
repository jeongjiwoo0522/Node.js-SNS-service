const express = require("express");

const { isLoggedIn } = require("./middleware");
const { Follow, User } = require("../models");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        const followingUser = await User.findOne({ where: { id: parseInt(req.params.id, 10) }});

        if(user && followingUser) {
            await Follow.create({
                FollowerId: user.id,
                FollowingId: followingUser.id,
            });
            res.send("success");
        } else {
            res.send("no user");
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;