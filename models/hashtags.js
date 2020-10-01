const Sequelize = require("sequelize");

module.exports = class Hashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            tableName: "hashtags",
            modelName: "Hashtag",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        });
    }    

    static associate(db) {

    }
};