const Sequelize = require('sequelize');

module.exports = class UserData extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        channelId: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'UserData',
        tableName: 'userdatas',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.UserData.belongsTo(db.User);
  }
};
