require('dotenv').config();
const { Admin, Category, Product, syncDatabase } = require('./src/models');

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

    // Create categories
    const cats = await Category.bulkCreate([
        { name: 'Sarees & Textiles', slug: 'sarees-textiles', description: 'Handwoven sarees from master weavers', image_url: null },
        { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', description: 'Traditional earthen art', image_url: null },
        { name: 'Jewellery', slug: 'jewellery', description: 'Tribal and temple jewellery', image_url: null },
        { name: 'Paintings', slug: 'paintings', description: 'Madhubani, Warli, Pattachitra', image_url: null },
        { name: 'Home Decor', slug: 'home-decor', description: 'Handcrafted for your home', image_url: null },
    ]);
    console.log(`✅ ${cats.length} categories created`);

    // Create sample products
    await Product.bulkCreate([
        { name: 'Handwoven Banarasi Silk Saree', slug: 'handwoven-banarasi-silk-saree', description: 'Authentic Banarasi silk with gold zari work by master weavers of Varanasi.', price: 4500, compare_price: 6000, stock: 15, category_id: cats[0].id, featured: true, images: [] },
        { name: 'Blue Pottery Flower Vase', slug: 'blue-pottery-flower-vase', description: 'Traditional Jaipur blue pottery with intricate floral patterns.', price: 850, compare_price: 1200, stock: 30, category_id: cats[1].id, featured: true, images: [] },
        { name: 'Tribal Silver Jhumka Earrings', slug: 'tribal-silver-jhumka-earrings', description: 'Hand-crafted silver jhumkas by Rajasthan tribal artisans.', price: 1200, stock: 20, category_id: cats[2].id, featured: true, images: [] },
        { name: 'Madhubani Painting – Radha Krishna', slug: 'madhubani-painting-radha-krishna', description: 'Original Madhubani painting from Bihar artisans on handmade paper.', price: 2200, stock: 8, category_id: cats[3].id, featured: false, images: [] },
        { name: 'Warli Art Wall Hanging', slug: 'warli-art-wall-hanging', description: 'Hand-painted Warli tribal art on wood from Maharashtra.', price: 1800, stock: 12, category_id: cats[4].id, featured: true, images: [] },
    ]);
    console.log('✅ Sample products created');

    console.log('\n🎉 Seed complete!\n');
    console.log('Admin Login: admin@culturalhatti.in / Admin@1234');
    process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
