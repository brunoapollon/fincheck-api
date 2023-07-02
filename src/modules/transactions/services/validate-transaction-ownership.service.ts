import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories ';

@Injectable()
export class ValidateTransactionOwnershipService {
  constructor(private readonly trnasactionRepository: TransactionsRepository) {}

  async validate(userId: string, transactionId: string) {
    const transaction = await this.trnasactionRepository.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundException('transaction not found!');
    }
    return null;
  }
}
