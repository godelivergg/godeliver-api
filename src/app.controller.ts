import { Controller, Headers, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { JwtAuthGuard } from "./auth/jwtAuth.guard";
import { AppService } from "./app.service";
import { ImportService } from "./app/import/import.service";
import { ReturnDto } from "./helpers/return.dto";
import { ImportTypeEnum } from "./types/importType.enum";

@Controller('import/file')
export class AppController {

    constructor(
        private readonly fileService: AppService,
        private readonly importService: ImportService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Multer.File,
        @Headers('type') importType: ImportTypeEnum | undefined
    ): Promise<ReturnDto> {

        if (!file || !file.path) {
            return <ReturnDto>{
                status: HttpStatus.BAD_REQUEST,
                message: "Nenhum arquivo enviado."
            };
        }

        const importInProgress = await this.importService.findAll({ finished: false });

        if (importInProgress.length > 0) {
            return <ReturnDto>{
                status: HttpStatus.CONFLICT,
                message: "Já existe uma importação em andamento."
            };
        }

        this.fileService.processUploadedFileInBackground(file.path, importType);

        return <ReturnDto>{
            status: HttpStatus.OK,
            message: "Arquivo recebido e processamento iniciado em segundo plano."
        };
    }
}