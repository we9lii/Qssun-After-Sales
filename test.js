import { Sequelize } from 'sequelize';

console.log('Starting test...');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './test.sqlite',
    logging: console.log
});

(async () => {
    try {
        console.log('Authenticating...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
        console.log('Synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
