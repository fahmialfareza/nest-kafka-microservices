import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MoreThanOrEqual } from 'typeorm';
import { TokenService } from './token.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
    ]);
    const request = context.switchToHttp().getRequest();

    try {
      const jwt = request.headers.authorization.replace('Bearer ', '');

      const { id, scope } = await this.jwtService.verify(jwt);

      const userToken = await this.tokenService.findOne({
        user_id: id,
        expired_at: MoreThanOrEqual(new Date()),
      });

      if (!userToken) {
        return false;
      }

      if (!roles.includes(scope)) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}
