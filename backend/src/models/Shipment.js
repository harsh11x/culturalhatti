const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Shipment = sequelize.define('Shipment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    tracking_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    courier_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tracking_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    shipped_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estimated_delivery: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    delivered_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'shipments',
    timestamps: true,
    underscored: true,
});

module.exports = Shipment;
