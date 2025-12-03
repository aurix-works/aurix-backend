import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { Log } from '../utils/aop';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: config.communication.email.service,
            auth: {
                user: config.communication.email.user,
                pass: config.communication.email.pass,
            },
        });
    }

    @Log()
    async sendEmail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: config.communication.email.user,
            to,
            subject,
            text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            Logger.info(`Email sent to ${to}`);
        } catch (error) {
            Logger.error('Error sending email', error);
            throw error;
        }
    }
}

export class SmsService {
    private client: twilio.Twilio;

    constructor() {
        this.client = twilio(
            config.communication.twilio.accountSid,
            config.communication.twilio.authToken,
        );
    }

    @Log()
    async sendSms(to: string, body: string): Promise<void> {
        try {
            const message = await this.client.messages.create({
                body,
                from: config.communication.twilio.phoneNumber,
                to,
            });
            Logger.info(`SMS sent to ${to}: ${message.sid}`);
        } catch (error) {
            Logger.error('Error sending SMS', error);
            throw error;
        }
    }
}

export class WhatsAppService {
    private client: twilio.Twilio;

    constructor() {
        this.client = twilio(
            config.communication.twilio.accountSid,
            config.communication.twilio.authToken,
        );
    }

    @Log()
    async sendWhatsApp(to: string, body: string): Promise<void> {
        try {
            const message = await this.client.messages.create({
                body,
                from: config.communication.twilio.whatsappNumber,
                to: `whatsapp:${to}`,
            });
            Logger.info(`WhatsApp message sent to ${to}: ${message.sid}`);
        } catch (error) {
            Logger.error('Error sending WhatsApp message', error);
            throw error;
        }
    }
}
