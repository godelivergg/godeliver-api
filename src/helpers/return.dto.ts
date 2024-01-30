import { HttpStatus } from '@nestjs/common';

export interface ReturnDto {
    status: HttpStatus;
    message?: string;
    records?: any;
}
