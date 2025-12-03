"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.connectMongoDB = exports.connectMySQL = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
// MySQL DataSource
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: index_1.config.db.host,
    port: index_1.config.db.port,
    username: index_1.config.db.username,
    password: index_1.config.db.password,
    database: index_1.config.db.name,
    synchronize: true, // Don't use this in production
    logging: false,
    entities: ['src/models/**/*.ts'],
    subscribers: [],
    migrations: [],
});
const connectMySQL = async () => {
    try {
        await exports.AppDataSource.initialize();
        logger_1.Logger.info('MySQL Database connected successfully');
    }
    catch (error) {
        logger_1.Logger.error('Error connecting to MySQL Database', error);
        process.exit(1);
    }
};
exports.connectMySQL = connectMySQL;
// MongoDB Connection
const connectMongoDB = async () => {
    try {
        await mongoose_1.default.connect(index_1.config.mongo.uri);
        logger_1.Logger.info('MongoDB connected successfully');
    }
    catch (error) {
        logger_1.Logger.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};
exports.connectMongoDB = connectMongoDB;
// Redis Client
exports.redisClient = new ioredis_1.default({
    host: index_1.config.redis.host,
    port: index_1.config.redis.port,
});
exports.redisClient.on('connect', () => {
    logger_1.Logger.info('Redis Client connected');
});
exports.redisClient.on('error', (err) => {
    logger_1.Logger.error('Redis Client Error', err);
});
