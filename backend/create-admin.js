require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Admin } = require('./models');

const createAdmin = async () => {
    try {
        // Check if admin exists
        const existing = await Admin.findOne({ where: { email: 'admin@culturalhatti.in' } });
        
        if (existing) {
            console.log('❌ Admin already exists. Deleting...');
            await existing.destroy();
        }

        // Create new admin with pre-hashed password
        const hashedPassword = await bcrypt.hash('Admin@1234', 12);
        
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@culturalhatti.in',
            password_hash: hashedPassword,
            role: 'superadmin',
        }, {
            hooks: false // Skip the beforeCreate hook since we're already hashing
        });

        console.log('✅ Admin created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: Admin@1234');
        console.log('\nYou can now login at: http://3.7.122.146:3002');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
