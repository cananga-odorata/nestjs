import { Test, TestingModule } from '@nestjs/testing';
import { GatewayService } from './gateway.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('GatewayService', () => {
  let service: GatewayService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatewayService,
        {
          provide: PrismaService,
          useValue: {
            customer: { findMany: jest.fn() },
            masterData: { findMany: jest.fn() },
            transaction: { findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<GatewayService>(GatewayService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAggregatedData', () => {
    it('should return aggregated data from all tables', async () => {
      // Mock data for each table
      const mockCustomers = [{ id: 1, name: 'Customer 1' }];
      const mockMasterData = [{ id: 1, type: 'Type 1', value: 'Value 1' }];
      const mockTransactions = [{ id: 1, customerId: 1, amount: 100, Customer: mockCustomers[0] }];

      // Set up mock implementations
      (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
      (prisma.masterData.findMany as jest.Mock).mockResolvedValue(mockMasterData);
      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      // Call the service method
      const result = await service.getAggregatedData();

      // Assertions
      expect(prisma.customer.findMany).toHaveBeenCalled();
      expect(prisma.masterData.findMany).toHaveBeenCalled();
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        include: { Customer: true },
      });

      expect(result).toEqual({
        customers: mockCustomers,
        masterData: mockMasterData,
        transactions: mockTransactions,
      });
    });
  });
});
