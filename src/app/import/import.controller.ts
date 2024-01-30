import { Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ImportService } from './import.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { ReturnDto } from '../..//helpers/return.dto';

@Controller('import')
export class ImportController {

    constructor(private readonly importService: ImportService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async index(@Req() request: Request): Promise<ReturnDto> {

        const options = {
            id: request.headers['id'],
            finished: request.headers['finished'],
        };

        return <ReturnDto>{
            status: HttpStatus.OK,
            records: await this.importService.findAll(options),
        };
    }

}