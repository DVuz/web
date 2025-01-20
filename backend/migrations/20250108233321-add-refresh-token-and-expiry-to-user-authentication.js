'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserAuthentication', 'refresh_token', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('UserAuthentication', 'token_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserAuthentication', 'refresh_token');
    await queryInterface.removeColumn('UserAuthentication', 'token_expires_at');
  },
};
