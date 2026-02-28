const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    min_order_value: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    max_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    max_uses: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'coupons',
    timestamps: true,
    underscored: true,
});

module.exports = Coupon;
