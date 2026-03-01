const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    razorpay_payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    razorpay_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR',
    },
    status: {
        type: DataTypes.ENUM('created', 'attempted', 'paid', 'failed', 'refunded'),
        defaultValue: 'created',
    },
    verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    refund_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    refund_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    refunded_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
});

module.exports = Payment;
