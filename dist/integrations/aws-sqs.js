"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQSService = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const aop_1 = require("../utils/aop");
class SQSService {
    constructor() {
        this.sqsClient = new client_sqs_1.SQSClient({
            region: config_1.config.aws.region,
            credentials: {
                accessKeyId: config_1.config.aws.accessKeyId,
                secretAccessKey: config_1.config.aws.secretAccessKey,
            },
        });
        this.queueUrl = config_1.config.aws.sqsQueueUrl;
    }
    async sendMessage(body) {
        const params = {
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(body),
        };
        try {
            const command = new client_sqs_1.SendMessageCommand(params);
            const data = await this.sqsClient.send(command);
            logger_1.Logger.info(`Message sent to SQS: ${data.MessageId}`);
        }
        catch (error) {
            logger_1.Logger.error('Error sending message to SQS', error);
            throw error;
        }
    }
}
exports.SQSService = SQSService;
__decorate([
    (0, aop_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SQSService.prototype, "sendMessage", null);
