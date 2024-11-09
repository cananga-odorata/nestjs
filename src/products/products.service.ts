// src/product/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { translations, ...productData } = createProductDto;
    
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        translations: {
          create: translations,
        },
      },
      include: {
        translations: true,
      },
    });

    return product;
  }

  async search(searchDto: SearchProductDto) {
    const { searchTerm, languageCode } = searchDto;
    const page = Number(searchDto.page);
    const pageSize = Number(searchDto.pageSize);
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductWhereInput = {
      translations: {
        some: {
          ...(languageCode && { languageCode }),
          ...(searchTerm && {
            name: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          }),
        },
      },
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          translations: true,
        },
        skip,
        take: pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
