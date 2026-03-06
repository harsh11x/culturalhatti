require('dotenv').config();
const { Product } = require('./models');

const run = async () => {
    const count = await Product.count();
    await Product.destroy({ where: {} });
    console.log(`Deleted ${count} products. Database is now empty. Add products manually via admin panel.`);
    process.exit(0);
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
