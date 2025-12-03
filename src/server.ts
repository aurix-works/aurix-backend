import 'reflect-metadata';
import app from './app';
import { config } from './config';
import { Logger } from './utils/logger';
import { connectMySQL, connectMongoDB } from './config/database';

const startServer = async () => {
    try {
        // Connect to Databases
        await connectMySQL();
        await connectMongoDB();
        // Redis connects automatically on import

        app.listen(config.port, () => {
            Logger.info(`Server running on port ${config.port}`);
            Logger.info(`Environment: ${config.nodeEnv}`);
        });
    } catch (error) {
        Logger.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();
