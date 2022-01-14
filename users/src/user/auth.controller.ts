import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenService } from './token.service';
import { AuthGuard } from './auth.guard';
import { KafkaService } from '../kafka/kafka.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private kafkaService: KafkaService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Req() request: Request) {
    const { password_confirm, ...data } = body;

    if (body.password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    const newUser = await this.userService.save({
      ...data,
      password: hashed,
    });

    await this.kafkaService.emit(['email_topic'], 'sendRegisterEmail', {
      email: newUser.email,
    });

    return { data: newUser };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
      scope: user.is_ambassador ? 'ambassador' : 'admin',
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await this.tokenService.save({
      user_id: user.id,
      token,
      created_at: new Date(),
      expired_at: tomorrow,
    });

    await this.kafkaService.emit(['email_topic'], 'sendLoginEmail', {
      email: user.email,
    });

    return { data: { token } };
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async user(@Req() request: Request) {
    const { id } = await this.jwtService.verify(
      request.headers.authorization.replace('Bearer ', ''),
    );

    const user = await this.userService.findOne({ id });

    return { data: user };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() request: Request) {
    const { id } = await this.jwtService.verify(
      request.headers.authorization.replace('Bearer ', ''),
    );

    await this.tokenService.delete({ user_id: id });

    return {
      message: 'success',
      data: {},
    };
  }

  @UseGuards(AuthGuard)
  @Put('user/info')
  async updateInfo(
    @Req() request: Request,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
  ) {
    const { id } = await this.jwtService.verify(
      request.headers.authorization.replace('Bearer ', ''),
    );

    await this.userService.update(id, {
      first_name,
      last_name,
    });

    const user = await this.userService.findOne({ id });

    return { data: user };
  }

  @UseGuards(AuthGuard)
  @Put('user/password')
  async updatePassword(
    @Req() request: Request,
    @Body('password') password: string,
    @Body('password_confirm') password_confirm: string,
  ) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const { id } = await this.jwtService.verify(
      request.headers.authorization.replace('Bearer ', ''),
    );

    await this.userService.update(id, {
      password: await bcrypt.hash(password, 12),
    });

    const user = await this.userService.findOne({ id });

    return { data: user };
  }
}
