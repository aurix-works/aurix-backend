import { AppDataSource, connectMongoDB, redisClient } from '../config/database';
import { Logger } from '../utils/logger';

beforeAll(async () => {
    // Silence logger during tests
    Logger.transports.forEach((t) => (t.silent = true));

    // Connect to databases
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // Drop and recreate schema
    await AppDataSource.synchronize(true);

    // await connectMongoDB(); // Uncomment if testing MongoDB
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    await redisClient.quit();
});
