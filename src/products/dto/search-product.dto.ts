import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchProductDto {
  @ApiProperty({ required: false, example: 'product', description: 'Search term' })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({ required: false, example: 'en', description: 'Language code to search in' })
  @IsString()
  @IsOptional()
  languageCode?: string;

  @ApiProperty({ default: 1, minimum: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ default: 10, minimum: 1, maximum: 100, description: 'Items per page' })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize: number = 10;
}