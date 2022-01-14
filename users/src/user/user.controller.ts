import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserService } from './user.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async all() {
    const users = await this.userService.find();

    return users;
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async get(@Param('id') id: number) {
    const user = await this.userService.findOne(id);

    return user;
  }
}
