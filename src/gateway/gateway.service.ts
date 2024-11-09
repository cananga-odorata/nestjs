import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GatewayService {
    constructor(private prisma: PrismaService) { }

    async getAggregatedData() {
        const customers = await this.prisma.customer.findMany();
        const masterData = await this.prisma.masterData.findMany();
        const transactions = await this.prisma.transaction.findMany({
            include: { Customer: true },
        });

        return { customers, masterData, transactions };
    }
}
