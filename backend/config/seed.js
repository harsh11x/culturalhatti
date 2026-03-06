require('dotenv').config();
const { Admin, Category, syncDatabase } = require('../models');

const seed = async () => {
    await syncDatabase({ force: true });
    console.log('🌱 Seeding database…');

    // Create superadmin
    await Admin.create({
        name: 'Super Admin',
        email: 'admin@culturalhatti.in',
        password_hash: 'Admin@1234',
        role: 'superadmin',
    });
    console.log('✅ Admin created: admin@culturalhatti.in / Admin@1234');

    // Create categories (only 4)
    const cats = await Category.bulkCreate([
        { name: 'Sarees', slug: 'sarees', description: 'Handwoven sarees from master weavers', image_url: null },
        { name: 'Suits', slug: 'suits', description: 'Traditional and modern suits', image_url: null },
        { name: 'Bags', slug: 'bags', description: 'Handcrafted premium bags', image_url: null },
        { name: 'Accessories', slug: 'accessories', description: 'Cultural accessories and add-ons', image_url: null },
    ]);
    console.log(`✅ ${cats.length} categories created`);

    console.log('\n🎉 Seed complete! Add products manually via admin panel.\n');
    console.log('Admin Login: admin@culturalhatti.in / Admin@1234');
    process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
