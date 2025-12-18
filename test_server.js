console.log('Test Server Starting...');
import express from 'express';
console.log('Express imported');
import cors from 'cors';
console.log('Cors imported');
import dotenv from 'dotenv';
console.log('Dotenv imported');
import { v2 as cloudinary } from 'cloudinary';
console.log('Cloudinary imported');
import { Sequelize, DataTypes } from 'sequelize';
console.log('Sequelize imported');
import path from 'path';
import { fileURLToPath } from 'url';
console.log('All imports done');

dotenv.config();
console.log('Dotenv configured');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('Dirname:', __dirname);

const app = express();
console.log('Express app created');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './test.sqlite',
    logging: console.log
});
console.log('Sequelize initialized');

(async () => {
    try {
        console.log('Authenticating...');
        await sequelize.authenticate();
        console.log('Auth success');
        await sequelize.sync();
        console.log('Sync success');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
