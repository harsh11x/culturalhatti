const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'superadmin'),
        defaultValue: 'admin',
    },
}, {
    tableName: 'admins',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password_hash) {
                admin.password_hash = await bcrypt.hash(admin.password_hash, 12);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('password_hash')) {
                admin.password_hash = await bcrypt.hash(admin.password_hash, 12);
            }
        },
    },
});

Admin.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password_hash);
};

module.exports = Admin;
