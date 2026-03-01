const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ORDER_STATUSES = [
    'pending_payment',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
];

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(...ORDER_STATUSES),
        defaultValue: 'pending_payment',
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    shipping_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    shipping_address: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    coupon_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tracking_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    courier_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cancelled_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    refund_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
});

module.exports = Order;
module.exports.ORDER_STATUSES = ORDER_STATUSES;
