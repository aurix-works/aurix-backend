import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Logger } from '../utils/logger';

async function seed() {
    try {
        await AppDataSource.initialize();
        Logger.info('Database connected for seeding');

        // Seeding logic removed as RBAC system is deleted.
        Logger.info('No data to seed.');

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        Logger.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
