const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            tableName: "users",
            modelName: "User",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post, { foreignKey: "UserId", sourceKey: "id" });
        db.User.hasMany(db.Follow, { foreignKey: "FollowerId", sourceKey: "id" });
        db.User.hasMany(db.Follow, { foreignKey: "FollowingId", sourceKey: "id" });
    }
};