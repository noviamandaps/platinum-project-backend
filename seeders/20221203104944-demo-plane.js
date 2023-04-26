"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Planes",
      [
        {
          namePlane: "ABX Air",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Aer Lingus",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Adriatic",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Anatolia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Atlanta Icelandic",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Finland",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air France",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "AIr Inuit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Japan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Srpska",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Tindi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Air Transat",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Alliance Airlines",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Surabaya Airlines",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          namePlane: "Yogjakarta Airlines",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Plane", null, {});
  },
};
