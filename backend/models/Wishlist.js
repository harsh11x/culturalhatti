const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: 'wishlists',
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'product_id'] }],
});

module.exports = Wishlist;
