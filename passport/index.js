const passport = require("passport");
const bcrypt = require("bcrypt");
const { sequelize } = require("../models");
const LocalStrategy = require("passport-local").Strategy;

const { User, Follow } = require("../models");

module.exports = function() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ where: { id }});

            const followingIds = await Follow.findAll({
                attributes: ["FollowingId"],
                where: { FollowerId: user.id },
            });


            const Followings = await Promise.all(
                followingIds.map(f => {
                    return User.findOne({ 
                        where: { id: f.FollowingId },
                        attributes: ["id", "nick"],
                    });
                })
            );
            user.dataValues.Followings = Followings;

            const followerIds = await Follow.findAll({
                attributes: ["FollowerId"],
                where: { FollowingId: user.id },
            });
            

            const Followers = await Promise.all(
                followerIds.map(f => {
                    return User.findOne({     
                        where: { id: f.FollowerId },
                        attributes: ["id", "nick"],
                    });
                })
            );
            user.dataValues.Followers = Followers;

            done(null, user.dataValues);
        } catch(err) {
            console.log(err);  
            done(err);
        }
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
};