import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchProductDto } from './dto/search-product.dto';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as request from 'supertest';



describe('ProductsService', () => {
    let service: ProductsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: PrismaService,
                    useValue: {
                        product: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            count: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe('create', () => {
        it('should create a product with translations', async () => {
            const mockProduct = {
                sku: 'TEST-123',
                price: 99.99,
                translations: [
                    {
                        languageCode: 'en',
                        name: 'Test Product',
                        description: 'Test Description',
                    },
                ],
            };

            await service.create(mockProduct);
            expect(prisma.product.create).toHaveBeenCalled();
        });
    });
});

describe('ProductsService - search method', () => {
    let service: ProductsService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: PrismaService,
                    useValue: {
                        product: {
                            findMany: jest.fn(),
                            count: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should return paginated products based on search criteria', async () => {
        // ข้อมูลสำหรับ test
        const mockProducts = [
            { id: 1, sku: 'PROD-123', translations: [{ languageCode: 'en', name: 'Test Product' }] },
        ];
        const mockTotal = 1;

        (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
        (prisma.product.count as jest.Mock).mockResolvedValue(mockTotal);

        // กำหนดเกณฑ์
        const searchDto: SearchProductDto = {
            searchTerm: 'Test',
            languageCode: 'en',
            page: 1,
            pageSize: 10,
        };

        // เรียกใช้งาน method
        const result = await service.search(searchDto);


        expect(prisma.product.findMany).toHaveBeenCalledWith({
            where: {
                translations: {
                    some: {
                        languageCode: 'en',
                        name: {
                            contains: 'Test',
                            mode: 'insensitive',
                        },
                    },
                },
            },
            include: {
                translations: true,
            },
            skip: 0,
            take: 10,
        });

        expect(prisma.product.count).toHaveBeenCalledWith({
            where: {
                translations: {
                    some: {
                        languageCode: 'en',
                        name: {
                            contains: 'Test',
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });

        expect(result).toEqual({
            data: mockProducts,
            pagination: {
                page: 1,
                pageSize: 10,
                total: mockTotal,
                totalPages: Math.ceil(mockTotal / 10),
            },
        });
    });
});


describe('ProductsService - Integration Test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should return products based on search criteria', async () => {
        const response = await request(app.getHttpServer())
            .get('/products/search')
            .query({ searchTerm: 'เสื้อ', languageCode: 'th', page: 1, pageSize: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.pagination.total).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await app.close();
    });
});


describe('Product E2E Tests', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // กำหนดค่า prisma หลังจากที่แอปพลิเคชันเริ่มทำงานแล้ว
        prisma = app.get(PrismaService);
    });

    beforeEach(async () => {
        // ลบข้อมูล translations และ products ก่อนการทดสอบแต่ละครั้ง
        await prisma.productTranslation.deleteMany();
        await prisma.product.deleteMany();

        // Seed database with a unique product
        await prisma.product.create({
            data: {
                sku: `PROD-${Date.now()}`,
                price: 100,
                translations: {
                    create: [{ languageCode: 'en', name: 'Test Product', description: 'Product Description' }],
                },
            },
        });
    });

    it('should return products based on search criteria', async () => {
        const response = await request(app.getHttpServer())
            .get('/products/search')
            .query({ searchTerm: 'Test', languageCode: 'en', page: 1, pageSize: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.pagination.total).toBeGreaterThan(0);
    });

    afterEach(async () => {
        // ลบข้อมูลในฐานข้อมูลหลังจากแต่ละการทดสอบ
        await prisma.productTranslation.deleteMany();
        await prisma.product.deleteMany();
    });

    afterAll(async () => {
        await app.close();
    });
});