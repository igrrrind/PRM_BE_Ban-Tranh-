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
      },
      {
        productName: 'Forest Path',
        briefDescription: 'A tranquil forest scene.',
        fullDescription: 'A peaceful path winding through a dense, green forest.',
        technicalSpecifications: 'Oil on canvas, 70x50cm',
        price: 220.00,
        imageURL: 'https://picsum.photos/id/1018/600/400',
        categoryID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'City Lights',
        briefDescription: 'Night cityscape.',
        fullDescription: 'A vibrant city at night, illuminated by thousands of lights.',
        technicalSpecifications: 'Acrylic on canvas, 80x60cm',
        price: 300.00,
        imageURL: 'https://picsum.photos/id/1025/600/400',
        categoryID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'Blue Horizon',
        briefDescription: 'Minimalist seascape.',
        fullDescription: 'A minimalist painting of the sea and sky meeting at the horizon.',
        technicalSpecifications: 'Oil on canvas, 100x50cm',
        price: 210.00,
        imageURL: 'https://picsum.photos/id/1043/600/400',
        categoryID: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'Golden Fields',
        briefDescription: 'Fields of gold.',
        fullDescription: 'Rolling fields of golden wheat under a bright sky.',
        technicalSpecifications: 'Acrylic on canvas, 60x40cm',
        price: 195.00,
        imageURL: 'https://picsum.photos/id/1056/600/400',
        categoryID: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productName: 'Mountain Majesty',
        briefDescription: 'Snow-capped mountains.',
        fullDescription: 'A majestic view of snow-capped mountains under a clear blue sky.',
        technicalSpecifications: 'Oil on canvas, 90x60cm',
        price: 275.00,
        imageURL: 'https://picsum.photos/id/1062/600/400',
        categoryID: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
