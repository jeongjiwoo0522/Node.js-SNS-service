const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { User } = require("../models");

module.exports = function() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(done);
    });

    
}