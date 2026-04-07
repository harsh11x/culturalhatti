const { Category } = require('./models');
const slugify = require('slugify');

async function ensureKidsCategory() {
    try {
        const name = 'Kids';
        const slug = 'kids';
        const [category, created] = await Category.findOrCreate({
            where: { slug },
            defaults: {
                name,
                slug,
                description: 'Toys, clothing, and accessories for kids.',
                is_active: true
            }
        });
        if (created) {
            console.log('Created Kids category');
        } else {
            console.log('Kids category already exists');
        }
    } catch (error) {
        console.error('Error ensuring Kids category:', error);
    } finally {
        process.exit();
    }
}

ensureKidsCategory();
