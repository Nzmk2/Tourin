import db from '../src/config/Database.js';
import User from '../src/models/UserModel.js';
import bcrypt from 'bcryptjs';

const seedAdminUser = async () => {
    try {
        // Ensure database connection is established and models are synced
        await db.authenticate();
        console.log('Database connection has been established successfully for admin seeder.');

        // Sync the model with alter option
        await User.sync({ alter: true });
        console.log('User model synchronized for admin seeder.');

        const adminData = {
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@tourin.com',
            password: 'admin123',
            passportNumber: 'ADMIN001',
            role: 'admin',
            refresh_token: null
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            where: { email: adminData.email }
        });

        if (existingAdmin) {
            console.log(`Admin user with email ${adminData.email} already exists. Skipping creation.`);
            return;
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        await User.create({
            ...adminData,
            password: hashedPassword
        });

        console.log(`Admin user '${adminData.email}' created successfully!`);
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await db.close();
        console.log('Database connection closed for admin seeder.');
    }
};

seedAdminUser();