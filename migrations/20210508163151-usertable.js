'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_table',{
      id: {type:Sequelize.INTEGER, uniqe:true, allowNull:false, primaryKey:true, autoIncrement:true},
      first_name: {type:Sequelize.STRING, allowNull: false},
      last_name: {type:Sequelize.STRING, allowNull: false},
      email: {type:Sequelize.STRING, allowNull: false},
      password: {type:Sequelize.STRING, allowNull: false},
      role: {type:Sequelize.STRING, allowNull: false},
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
