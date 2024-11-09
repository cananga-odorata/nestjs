import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayController } from './gateway.controller';
import { PrismaModule } from '../../prisma/peisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GatewayService],
  controllers: [GatewayController]
})
export class GatewayModule { }
