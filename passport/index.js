const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const { User } = require("../models");
const { connect } = require("../app");

module.exports = function() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(done);
    });

    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: email });
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: "비밀번호가 일치하지 않습니다." });
                }
            } else {
                done(null, false, { message: "가입되지 않은 회원입니다." });
            }
        } catch(err) {
            console.error(err);
            done(err);
        }
    }));
};