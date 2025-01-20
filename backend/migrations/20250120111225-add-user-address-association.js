// migrations/YYYYMMDDHHMMSS-add-user-address-association.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists first
    const tableDescription = await queryInterface.describeTable('AddressInfo');
    
    if (!tableDescription.user_id) {
      // Only add the column if it doesn't exist
      await queryInterface.addColumn('AddressInfo', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }

    // Check if the index exists before adding it
    // Get all indexes of the table
    const tableIndexes = await queryInterface.showIndex('AddressInfo');
    const hasUserIdIndex = tableIndexes.some(index => index.fields.some(field => field.attribute === 'user_id'));

    if (!hasUserIdIndex) {
      await queryInterface.addIndex('AddressInfo', ['user_id']);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if the index exists before removing it
    const tableIndexes = await queryInterface.showIndex('AddressInfo');
    const hasUserIdIndex = tableIndexes.some(index => index.fields.some(field => field.attribute === 'user_id'));

    if (hasUserIdIndex) {
      await queryInterface.removeIndex('AddressInfo', ['user_id']);
    }

    // Check if the column exists before removing it
    const tableDescription = await queryInterface.describeTable('AddressInfo');
    if (tableDescription.user_id) {
      await queryInterface.removeColumn('AddressInfo', 'user_id');
    }
  }
};