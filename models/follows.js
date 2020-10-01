const Sequelize = require("sequelize");

module.exports = class Follow extends Sequelize.Model {
    static init(sequelize) {
        return super.init({}, {
            sequelize, 
            timestamps: false,
            underscored: false,
            paranoid: false,
            tableName: "follows",
            modelName: "Follow",
        });
    }

    static associate(db) {
        db.Follow.belongsTo(db.User, { foreignKey: "FollowerId", targetKey: "id" });
        db.Follow.belongsTo(db.User, { foreignKey: "FollowingId", targetKey: "id" });
    }
};