'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ChatMessages', [
      {
        userID: 2,
        message: 'Hi, I am interested in the Sunset Over Lake painting!',
        sentAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChatMessages', null, {});
  }
};
