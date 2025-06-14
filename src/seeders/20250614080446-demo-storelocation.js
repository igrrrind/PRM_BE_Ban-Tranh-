'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('StoreLocations', [
      {
        latitude: 40.712776,
        longitude: -74.005974,
        address: '789 Gallery Rd, Paint City',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('StoreLocations', null, {});
  }
};
