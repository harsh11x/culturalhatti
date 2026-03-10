const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RETURN_STATUSES = ['pending', 'approved', 'rejected', 'completed'];

const ReturnRequest = sequelize.define('ReturnRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(...RETURN_STATUSES),
        defaultValue: 'pending',
    },
    admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'return_requests',
    timestamps: true,
    underscored: true,
});

module.exports = ReturnRequest;
module.exports.RETURN_STATUSES = RETURN_STATUSES;
