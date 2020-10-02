exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/?loginError=${encodeURIComponent("로그인 필요")}`);
    }
}; 

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/?error=${encodeURIComponent("로그인한 상태입니다")}`);
    }
};