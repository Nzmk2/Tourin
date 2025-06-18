import db from '../src/config/Database.js';
import User from '../src/models/UserModel.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
    try {
        // Ensure database connection is established and models are synced
        await db.authenticate();
        console.log('Database connection has been established successfully for user seeder.');

        // Sync the model with alter option
        await User.sync({ alter: true });
        console.log('User model synchronized for user seeder.');

        const usersToSeed = [
            {
                firstName: 'Regular',
                lastName: 'User',
                email: 'user@tourin.com',
                password: 'user123',
                passportNumber: 'USER001',
                role: 'user',
                refresh_token: null
            }
        ];

        for (const userData of usersToSeed) {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                console.log(`User with email ${userData.email} already exists. Skipping creation.`);
                continue;
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            await User.create({
                ...userData,
                password: hashedPassword
            });

            console.log(`User '${userData.email}' created successfully!`);
        }

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await db.close();
        console.log('Database connection closed for user seeder.');
    }
};

seedUsers();