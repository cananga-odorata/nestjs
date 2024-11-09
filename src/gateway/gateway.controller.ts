import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('gateway')
export class GatewayController {
    constructor(private gatewayService: GatewayService) { }

    @Get('data')
    async getData() {
        return await this.gatewayService.getAggregatedData();
    }
}
