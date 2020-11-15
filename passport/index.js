const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;

const { User, Follow } = require("../models");

module.exports = function() {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (obj, done) => {
        done(obj);
    });

    passport.use(new LocalStrategy({ 
        usernameField: "email",
        passwordField: "password",
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email } });
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

    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: "/auth/kakao/callback",
    }, async (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: "kakao" },
            });
            if(exUser) {
                return cb(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: "kakao",
                });
                cb(null, newUser);
            }
        } catch(err) {
            console.error(err);
            cb(err);
        }
    }));
};