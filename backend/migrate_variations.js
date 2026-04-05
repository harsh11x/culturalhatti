require('dotenv').config();
const sequelize = require('./config/db');

(async () => {
  try {
    await sequelize.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS variations JSONB DEFAULT \'[]\'::jsonb;');
    await sequelize.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variation_selected JSONB;');
    console.log('Migration successful');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();
