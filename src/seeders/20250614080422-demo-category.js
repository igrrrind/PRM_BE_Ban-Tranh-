'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { categoryName: 'Landscape', createdAt: new Date(), updatedAt: new Date() },
      { categoryName: 'Portrait', createdAt: new Date(), updatedAt: new Date() },
      { categoryName: 'Abstract', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
