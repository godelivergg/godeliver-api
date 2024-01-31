import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { OrderService } from './order.service';
import { ReturnDto } from '../../helpers/return.dto';


@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async index(@Req() request: Request): Promise<ReturnDto> {

        const options = await this.orderService.buildOptionsFromHeaders(request.headers)

        const orders = await this.orderService.findAll(options);

        return <ReturnDto>{
            status: HttpStatus.OK,
            pagination: {
                offset: options.offset,
                limit: options.limit,
                size: orders.length
            },
            records: orders,
        };
    }

}
