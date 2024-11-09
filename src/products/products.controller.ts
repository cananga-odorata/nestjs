import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiController } from '../common/swagger/swagger.decorator';

@ApiTags('Products') 
@ApiController('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'บันทึกข้อมูล Product' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
  @ApiOperation({ summary: 'ค้าหารายการ', description: 'โดยใส่ Field เพื่อ search' })
  @Get('search')
  search(@Query() searchDto: SearchProductDto) {
    return this.productsService.search(searchDto);
  }
}