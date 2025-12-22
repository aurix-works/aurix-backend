import { EmailService, SmsService, WhatsAppService } from '../integrations/communication';
import { SQSService } from '../integrations/aws-sqs';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

// Mock dependencies
jest.mock('nodemailer');
jest.mock('twilio');
jest.mock('@aws-sdk/client-sqs');

describe('Integration Services', () => {
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('EmailService', () => {
        let sendMailMock: jest.Mock;

        beforeEach(() => {
            sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-id' });
            (nodemailer.createTransport as jest.Mock).mockReturnValue({
                sendMail: sendMailMock,
            });
        });

        it('should send an email successfully', async () => {
            const emailService = new EmailService();
            await emailService.sendEmail('test@example.com', 'Subject', 'Body');

            expect(nodemailer.createTransport).toHaveBeenCalled();
            expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
                to: 'test@example.com',
                subject: 'Subject',
                text: 'Body',
            }));
        });

        it('should throw error when email sending fails', async () => {
            sendMailMock.mockRejectedValue(new Error('SMTP Error'));
            const emailService = new EmailService();

            await expect(emailService.sendEmail('test@example.com', 'Subject', 'Body'))
                .rejects.toThrow('SMTP Error');
        });
    });

    describe('SmsService', () => {
        let createMessageMock: jest.Mock;

        beforeEach(() => {
            createMessageMock = jest.fn().mockResolvedValue({ sid: 'sms-sid' });
            (twilio as unknown as jest.Mock).mockReturnValue({
                messages: {
                    create: createMessageMock,
                },
            });
        });

        it('should send an SMS successfully', async () => {
            const smsService = new SmsService();
            await smsService.sendSms('+1234567890', 'Hello SMS');

            expect(twilio).toHaveBeenCalled();
            expect(createMessageMock).toHaveBeenCalledWith(expect.objectContaining({
                to: '+1234567890',
                body: 'Hello SMS',
            }));
        });

        it('should throw error when SMS sending fails', async () => {
            createMessageMock.mockRejectedValue(new Error('Twilio Error'));
            const smsService = new SmsService();

            await expect(smsService.sendSms('+1234567890', 'Hello SMS'))
                .rejects.toThrow('Twilio Error');
        });
    });

    describe('WhatsAppService', () => {
        let createMessageMock: jest.Mock;

        beforeEach(() => {
            createMessageMock = jest.fn().mockResolvedValue({ sid: 'wa-sid' });
            (twilio as unknown as jest.Mock).mockReturnValue({
                messages: {
                    create: createMessageMock,
                },
            });
        });

        it('should send a WhatsApp message successfully', async () => {
            const whatsAppService = new WhatsAppService();
            await whatsAppService.sendWhatsApp('+1234567890', 'Hello WhatsApp');

            expect(twilio).toHaveBeenCalled();
            expect(createMessageMock).toHaveBeenCalledWith(expect.objectContaining({
                to: 'whatsapp:+1234567890',
                body: 'Hello WhatsApp',
            }));
        });

        it('should throw error when WhatsApp sending fails', async () => {
            createMessageMock.mockRejectedValue(new Error('Twilio Error'));
            const whatsAppService = new WhatsAppService();

            await expect(whatsAppService.sendWhatsApp('+1234567890', 'Hello WhatsApp'))
                .rejects.toThrow('Twilio Error');
        });
    });

    describe('SQSService', () => {
        let sendMock: jest.Mock;

        beforeEach(() => {
            sendMock = jest.fn().mockResolvedValue({ MessageId: 'sqs-id' });
            (SQSClient as unknown as jest.Mock).mockImplementation(() => ({
                send: sendMock,
            }));
        });

        it('should send a message to SQS successfully', async () => {
            const sqsService = new SQSService();
            await sqsService.sendMessage({ key: 'value' });

            expect(SQSClient).toHaveBeenCalled();
            expect(sendMock).toHaveBeenCalledWith(expect.any(SendMessageCommand));
        });

        it('should throw error when SQS sending fails', async () => {
            sendMock.mockRejectedValue(new Error('AWS Error'));
            const sqsService = new SQSService();

            await expect(sqsService.sendMessage({ key: 'value' }))
                .rejects.toThrow('AWS Error');
        });
    });
});
