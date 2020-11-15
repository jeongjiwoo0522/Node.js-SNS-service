const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send("로그인 필요");
    }
}; 

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent("로그인한 상태입니다.");
        res.redirect(`/error=${message}`);
    }
};

exports.verifyToken = async (req, res, next) => {
    console.log(req.cookies);
    const jwt_token = req.cookies.JWT;
    req.decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
    const id = req.decoded.id;
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

        req.user = user.dataValues
        next();
    } catch(err) {
        if(err.name === "TokenExpiredError") {
            return res.status(401).json({
                code: 401,
                message: "토큰이 만료되었습니다",
            });
        }
        console.log(err);
        next(err);
    }
}