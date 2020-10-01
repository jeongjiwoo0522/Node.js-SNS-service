const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            tableName: "posts",
            modelName: "Post",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        });
    }

    static associate(db) {

    }
};