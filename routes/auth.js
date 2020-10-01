const express = require("express");
const bcrypt = require("bcrypt");

const { isLoggedIn, isNotLoggedIn } = require("./middleware");
const { User } = require("../models");
const { noExtendLeft } = require("sequelize/types/lib/operators");
const passport = require("passport");

const router = express.Router();

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("/");
        });
    })(req, res, next);
});

router.post("/join", isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if(exUser) {
            return res.redirect("/join?error=exist");
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect("/");
    } catch(err) {
        console.error(err);
        return next(err);
    }   
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;