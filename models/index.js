const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

const User = require("./users");
const Post = require("./posts");
const Hashtag = require("./hashtags");
const PostHashtag = require("./posthashtags");
const Follow = require("./follows");

sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Post = Post,
db.Hashtag = Hashtag,
db.PostHashtag = PostHashtag;
db.Follow = Follow;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
PostHashtag.init(sequelize);
Follow.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
PostHashtag.associate(db);
Follow.associate(db);

module.exports = db;
