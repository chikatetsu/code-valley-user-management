import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@domain/user/entities/user.entity';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    const checks = [
      {
        id: params.id,
        repository: this.userRepository,
        message: 'User not found',
      },
    ];

    const checkPromises = checks
      .filter((check) => check.id !== undefined && check.id !== null)
      .map((check) =>
        check.repository.findOne({ where: { id: check.id } }).then((entity) => {
          if (!entity) {
            throw new NotFoundException(check.message);
          }
        }),
      );

    return from(Promise.all(checkPromises)).pipe(
      switchMap(() => next.handle()),
    );
  }
}
