export interface LoggerInterface {

    createLog(mensage: string): string;

    sendLog(log: string): void;

    logMessage(mensage: string): void;
}