import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

jest.mock('@nestjs/core');


describe('Main', () => {
    it('should call NestFactory.create and app.listen', async () => {
        const mockListen = jest.fn();
        const mockUse = jest.fn();
        const mockEnableCors = jest.fn();

        const mockApp = {
            use: mockUse,
            enableCors: mockEnableCors,
            listen: mockListen,
        };

        (NestFactory.create as jest.Mock).mockResolvedValue(mockApp as any);

        await import('../main');

        expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

        expect(mockUse).toHaveBeenCalledWith(expect.any(Function));
        expect(mockEnableCors).toHaveBeenCalledWith({
            origin: "*",
            allowedHeaders: ['Accept', 'Content-Type'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        });

        expect(mockListen).toHaveBeenCalledWith(process.env.PORT || 8080);
    });
});