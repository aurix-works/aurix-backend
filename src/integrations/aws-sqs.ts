import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { config } from '../config';
import { Logger } from '../utils/logger';
import { Log } from '../utils/aop';

export class SQSService {
    private sqsClient: SQSClient;
    private queueUrl: string;

    constructor() {
        this.sqsClient = new SQSClient({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
        });
        this.queueUrl = config.aws.sqsQueueUrl;
    }

    @Log()
    async sendMessage(body: any): Promise<void> {
        const params = {
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(body),
        };

        try {
            const command = new SendMessageCommand(params);
            const data = await this.sqsClient.send(command);
            Logger.info(`Message sent to SQS: ${data.MessageId}`);
        } catch (error) {
            Logger.error('Error sending message to SQS', error);
            throw error;
        }
    }
}
