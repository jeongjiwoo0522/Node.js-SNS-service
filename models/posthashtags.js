const Sequelize = require("sequelize");

module.exports = class PostHashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            paranoid: false,
            modelName: "PostHashtag",
            tableName: "posthashtags",
        });
    }

    static associate(db) {
        db.PostHashtag.belongsTo(db.Post, { foreignKey: "PostId", targetKey: "id" });
        db.PostHashtag.belongsTo(db.Hashtag, { foreignKey: "HashtagId", targetKey: "id" });
    }
};