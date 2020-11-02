const User = require("../models/users");
const Follow = require("../models/follows");

exports.addFollowing = async (req, res, next) => {
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
          res.status(404).send("no user");
      }
  } catch(error) {
      console.error(error);
      next(error);
  }
};