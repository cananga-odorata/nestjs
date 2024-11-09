import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

describe('GatewayController', () => {
  let controller: GatewayController;
  let service: GatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: GatewayService,
          useValue: {
            getAggregatedData: jest.fn(),  // Mock getAggregatedData method
          },
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    service = module.get<GatewayService>(GatewayService);
  });

  describe('getData', () => {
    it('should call gatewayService.getAggregatedData and return the result', async () => {
      // Mock data for getAggregatedData response
      const mockResult = {
        customers: [{ id: 1, name: 'Customer 1' }],
        masterData: [{ id: 1, type: 'Type 1', value: 'Value 1' }],
        transactions: [{ id: 1, customerId: 1, amount: 100 }],
      };

      // Mock implementation of getAggregatedData
      (service.getAggregatedData as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      const result = await controller.getData();

      // Assertions
      expect(service.getAggregatedData).toHaveBeenCalled();  // Check if service method is called
      expect(result).toEqual(mockResult);  // Check if the result is as expected
    });
  });
});
