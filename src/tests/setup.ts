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
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.query(`DELETE FROM ${entity.tableName}`);
    }
    await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    // await connectMongoDB(); // Uncomment if testing MongoDB
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    await redisClient.quit();
});
