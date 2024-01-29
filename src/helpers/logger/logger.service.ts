import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { LoggerInterface } from './logger.interface';

@Injectable()
export class GCPLoggerService implements LoggerInterface {

    private readonly logger: any;

    constructor() {
        this.logger = createLogger({
            format: format.simple(),
            transports: [
                new LoggingWinston(),
            ],
        });
    }

    createLog(mensage: string): string {
        return `[GCP] ${mensage}`
    }

    sendLog(log: string): void {
        console.log(log)
        this.logger.info(log);
    }

    logMessage(mensage: string): void {
        const log = this.createLog(mensage);
        this.sendLog(log)
    }
}

@Injectable()
export class LocalLoggerService implements LoggerInterface {

    createLog(mensage: string): string {
        return `[Local Log] ${mensage}`
    }

    sendLog(log: string): void {
        console.log(log)
    }

    logMessage(mensage: string): void {
        const log = this.createLog(mensage);
        this.sendLog(log)
    }
}
