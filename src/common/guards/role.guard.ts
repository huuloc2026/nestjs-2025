import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES } from 'src/common/decorators/role.decorator';
import { RequestWithUser } from 'src/common/types/requests.type';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly refector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.refector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: RequestWithUser = context.switchToHttp().getRequest();
    return roles.includes(request.user.role as unknown as string);
  }
}
