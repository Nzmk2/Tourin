// seeders/userSeeder.js
import db from '../src/config/database.js'; // Adjust path based on your project structure
import User from '../src/models/UserModel.js'; // Adjust path
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
    try {
        // Ensure database connection is established and models are synced
        await db.authenticate();
        console.log('Database connection has been established successfully for user seeder.');

        // This will attempt to sync the model, creating the 'users' table if it doesn't exist
        await User.sync({ alter: true });
        console.log('User model synchronized for user seeder.');

        const usersToSeed = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                passportNumber: 'JD123456',
                role: 'user'
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                password: 'password456',
                passportNumber: 'JS789012',
                role: 'user'
            },
            {
                firstName: 'Peter',
                lastName: 'Jones',
                email: 'peter.jones@example.com',
                password: 'password789',
                passportNumber: 'PJ345678',
                role: 'user'
            }
        ];

        for (const userData of usersToSeed) {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                console.log(`User with email ${userData.email} already exists. Skipping creation.`);
                continue; // Move to the next user
            }

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            await User.create({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: hashedPassword,
                passportNumber: userData.passportNumber,
                role: userData.role
            });

            console.log(`User '${userData.email}' created successfully!`);
        }

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await db.close(); // Close the database connection after seeding
        console.log('Database connection closed for user seeder.');
    }
};

seedUsers();
