import { IsString, IsNumber, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationDto {
  @ApiProperty({ example: 'en', description: 'Language code (e.g., en, th)' })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @ApiProperty({ example: 'Product Name', description: 'Product name in specified language' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Product Description', description: 'Product description in specified language' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'PROD-123', description: 'Product SKU' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 99.99, description: 'Product price' })
  @IsNumber()
  price: number;

  @ApiProperty({ type: [TranslationDto], description: 'Product translations' })
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}