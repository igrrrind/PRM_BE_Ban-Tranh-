'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        productName: 'Sunset Over Lake',
        briefDescription: 'A beautiful sunset landscape.',
        fullDescription: 'A detailed painting of a sunset over a calm lake, with vibrant colors and reflections.',
        technicalSpecifications: 'Oil on canvas, 60x40cm',
        price: 250.00,
        imageURL: 'https://example.com/sunset.jpg',
        categoryID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'Modern Abstract',
        briefDescription: 'Colorful abstract art.',
        fullDescription: 'A modern abstract painting with bold colors and geometric shapes.',
        technicalSpecifications: 'Acrylic on canvas, 50x50cm',
        price: 180.00,
        imageURL: 'https://example.com/abstract.jpg',
        categoryID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
