import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [ProductsModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
