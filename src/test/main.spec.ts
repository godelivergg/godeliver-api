import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

jest.mock('@nestjs/core');


describe('Main', () => {
    it('should call NestFactory.create and app.listen', async () => {
        const mockListen = jest.fn();

        (NestFactory.create as jest.Mock).mockResolvedValue({
            listen: mockListen,
        } as any);

        await import('../main');

        expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
        expect(mockListen).toHaveBeenCalledWith(process.env.PORT || 8080);
    });
});