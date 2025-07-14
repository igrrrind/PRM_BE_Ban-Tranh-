'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove cartID column
    await queryInterface.removeColumn('Orders', 'cartID');

    // 2. Add total column
    await queryInterface.addColumn('Orders', 'total', {
      type: Sequelize.INTEGER,
      allowNull: true, // adjust based on your business rules
    });

    // 3. Change orderStatus to ENUM
    await queryInterface.changeColumn('Orders', 'orderStatus', {
      type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Add back cartID column
    await queryInterface.addColumn('Orders', 'cartID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Carts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // 2. Remove total column
    await queryInterface.removeColumn('Orders', 'total');

    // 3. Change orderStatus back to STRING
    await queryInterface.changeColumn('Orders', 'orderStatus', {
      type: Sequelize.STRING,
    });

    // Drop ENUM type to clean up if necessary
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_orderStatus";');
  }
};
