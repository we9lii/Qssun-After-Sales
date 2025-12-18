import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

console.log('Testing connection...');
console.log('URL:', process.env.DATABASE_URL ? 'Found' : 'Missing');

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is missing!');
    process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: msg => console.log('[Sequelize]', msg)
});

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', JSON.stringify(error, null, 2));
        if (error.original) console.error('Original error:', error.original);
        if (error.parent) console.error('Parent error:', error.parent);
    } finally {
        await sequelize.close();
    }
}

test();
