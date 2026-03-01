const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    compare_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    images: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    weight_grams: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
});

module.exports = Product;
