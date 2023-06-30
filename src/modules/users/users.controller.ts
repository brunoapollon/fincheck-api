import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ActtiveUserId } from 'src/shared/decorators/ActiveUserId';

@Controller('users')
export class UsersController {
  constructor(private readonly userServide: UsersService) {}

  @Get('/me')
  me(@ActtiveUserId() userId: string) {
    return this.userServide.getUserById(userId);
  }
}
