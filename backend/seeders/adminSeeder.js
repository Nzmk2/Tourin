// seeders/adminSeeder.js
import db from '../src/config/database.js'; // Adjust path based on your project structure
import User from '../src/models/UserModel.js'; // Adjust path
import bcrypt from 'bcryptjs';

const seedAdminUser = async () => {
    try {
        // Ensure database connection is established and models are synced
        await db.authenticate();
        console.log('Database connection has been established successfully for seeder.');

        // This will attempt to sync the model, creating the 'users' table if it doesn't exist
        // and ensuring the 'role' column is present.
        await User.sync({ alter: true });
        console.log('User model synchronized for seeder.');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpassword123'; // Choose a strong password for your admin

        // Check if admin user already exists
        const existingAdmin = await User.findOne({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log(`Admin user with email ${adminEmail} already exists. Skipping creation.`);
            return;
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            firstName: 'Super',
            lastName: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            passportNumber: 'ADMIN001', // Example passport number for admin
            role: 'admin' // Explicitly set role to 'admin'
        });

        console.log(`Admin user '${adminEmail}' created successfully!`);
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        await db.close(); // Close the database connection after seeding
        console.log('Database connection closed.');
    }
};

seedAdminUser();