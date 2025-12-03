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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = exports.SmsService = exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const aop_1 = require("../utils/aop");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: config_1.config.communication.email.service,
            auth: {
                user: config_1.config.communication.email.user,
                pass: config_1.config.communication.email.pass,
            },
        });
    }
    async sendEmail(to, subject, text) {
        const mailOptions = {
            from: config_1.config.communication.email.user,
            to,
            subject,
            text,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            logger_1.Logger.info(`Email sent to ${to}`);
        }
        catch (error) {
            logger_1.Logger.error('Error sending email', error);
            throw error;
        }
    }
}
exports.EmailService = EmailService;
__decorate([
    (0, aop_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "sendEmail", null);
class SmsService {
    constructor() {
        this.client = (0, twilio_1.default)(config_1.config.communication.twilio.accountSid, config_1.config.communication.twilio.authToken);
    }
    async sendSms(to, body) {
        try {
            const message = await this.client.messages.create({
                body,
                from: config_1.config.communication.twilio.phoneNumber,
                to,
            });
            logger_1.Logger.info(`SMS sent to ${to}: ${message.sid}`);
        }
        catch (error) {
            logger_1.Logger.error('Error sending SMS', error);
            throw error;
        }
    }
}
exports.SmsService = SmsService;
__decorate([
    (0, aop_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SmsService.prototype, "sendSms", null);
class WhatsAppService {
    constructor() {
        this.client = (0, twilio_1.default)(config_1.config.communication.twilio.accountSid, config_1.config.communication.twilio.authToken);
    }
    async sendWhatsApp(to, body) {
        try {
            const message = await this.client.messages.create({
                body,
                from: config_1.config.communication.twilio.whatsappNumber,
                to: `whatsapp:${to}`,
            });
            logger_1.Logger.info(`WhatsApp message sent to ${to}: ${message.sid}`);
        }
        catch (error) {
            logger_1.Logger.error('Error sending WhatsApp message', error);
            throw error;
        }
    }
}
exports.WhatsAppService = WhatsAppService;
__decorate([
    (0, aop_1.Log)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WhatsAppService.prototype, "sendWhatsApp", null);
