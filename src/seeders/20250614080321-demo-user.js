'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        passwordHash: 'hashedpassword1',
        email: 'admin@paintingstore.com',
        phoneNumber: '1234567890',
        address: '123 Art St, Paint City',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'customer1',
        passwordHash: 'hashedpassword2',
        email: 'customer1@paintingstore.com',
        phoneNumber: '0987654321',
        address: '456 Canvas Ave, Paint City',
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
