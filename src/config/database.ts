import { DataSource } from 'typeorm';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { config } from './index';
import { Logger } from '../utils/logger';

// MySQL DataSource
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    synchronize: false, // Don't use this in production
    logging: false,
    entities: [__dirname + '/../models/**/*.{ts,js}'],
    subscribers: [],
    migrations: [],
});

export const connectMySQL = async () => {
    try {
        await AppDataSource.initialize();
        Logger.info('MySQL Database connected successfully');
    } catch (error) {
        Logger.error('Error connecting to MySQL Database', error);
        process.exit(1);
    }
};

// MongoDB Connection
export const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongo.uri);
        Logger.info('MongoDB connected successfully');
    } catch (error) {
        Logger.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

// Redis Client
export const redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
});

redisClient.on('connect', () => {
    Logger.info('Redis Client connected');
});

redisClient.on('error', (err) => {
    Logger.error('Redis Client Error', err);
});
