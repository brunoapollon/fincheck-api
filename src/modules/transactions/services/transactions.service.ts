import { Injectable } from '@nestjs/common';
import { ValidateBankAccountOwnershipService } from 'src/modules/bank-accounts/services/validate-bank-account-ownership.service';

import { ValidateCategoryOwnershipService } from 'src/modules/categories/services/validate-category-ownership.service';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories ';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, date, name, type, value } =
      createTransactionDto;
    await this.validateEntitesOwnership({ userId, categoryId, bankAccountId });

    return this.transactionsRepository.create({
      data: {
        userId,
        date,
        name,
        type,
        value,
        bankAccountId,
        categoryId,
      },
    });
  }

  findAllByUserId(userId: string) {
    return this.transactionsRepository.findMany({
      where: {
        userId,
      },
    });
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, date, name, type, value } =
      updateTransactionDto;
    await this.validateEntitesOwnership({
      userId,
      categoryId,
      bankAccountId,
      transactionId,
    });

    return this.transactionsRepository.update({
      where: {
        id: transactionId,
      },
      data: {
        userId,
        date,
        name,
        type,
        value,
        bankAccountId,
        categoryId,
      },
    });
  }

  async delete(userId: string, transactionId: string) {
    await this.validateEntitesOwnership({ userId, transactionId });
    await this.transactionsRepository.delete({
      where: {
        id: transactionId,
      },
    });

    return null;
  }

  private async validateEntitesOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
  }: {
    userId?: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
      bankAccountId &&
        this.validateBankAccountOwnershipService.validate(
          userId,
          bankAccountId,
        ),
      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),
    ]);
  }
}
