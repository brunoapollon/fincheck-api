import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userServide: UsersService) {}

  @Get('/me')
  me(@Req() request: any) {
    return this.userServide.getUserById(request.userId);
  }
}
