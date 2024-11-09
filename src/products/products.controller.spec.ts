import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should call ProductsService.create with the correct parameters', async () => {
      const createProductDto: CreateProductDto = {
        sku: 'PROD-123',
        price: 99.99,
        translations: [
          {
            languageCode: 'en',
            name: 'Test Product',
            description: 'Test Description',
          },
        ],
      };

      const mockResult = { id: 1, ...createProductDto };
      (service.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.create(createProductDto);

      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('search', () => {
    it('should call ProductsService.search with the correct parameters', async () => {
      const searchDto: SearchProductDto = {
        searchTerm: 'Test',
        languageCode: 'en',
        page: 1,
        pageSize: 10,
      };

      const mockResult = {
        data: [
          { id: 1, sku: 'PROD-123', translations: [{ languageCode: 'en', name: 'Test Product' }] },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
        },
      };

      (service.search as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.search(searchDto);

      expect(service.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockResult);
    });
  });
});
