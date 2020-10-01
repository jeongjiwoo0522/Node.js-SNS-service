const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const User = require("./users");
const Comment = require("./comments");
const Hashtag = require("./hashtags");

sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Comment = Comment,
db.Hashtag = Hashtag,

User.init(sequelize);
Comment.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Comment.associate(db);
Hashtag.associate(db);

module.exports = db;
