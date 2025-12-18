import { AppDataSource, connectMongoDB, redisClient } from '../config/database';
import { Logger } from '../utils/logger';

beforeAll(async () => {
    // Silence logger during tests
    Logger.transports.forEach((t) => (t.silent = true));

    // Connect to databases
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // Clear data
    // Drop and recreate schema to handle structural changes
    // Drop all tables manually to handle structural changes
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');

    // Explicitly drop potential conflict tables
    await AppDataSource.query('DROP TABLE IF EXISTS users');
    await AppDataSource.query('DROP TABLE IF EXISTS system_users');

    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
        await AppDataSource.query(`DROP TABLE IF EXISTS ${entity.tableName}`);
    }
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    // Recreate schema
    await AppDataSource.synchronize();
    // await connectMongoDB(); // Uncomment if testing MongoDB
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    await redisClient.quit();
});
