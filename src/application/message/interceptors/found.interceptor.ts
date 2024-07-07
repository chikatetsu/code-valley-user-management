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
import { Message } from '@domain/message/entities/message.entity';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const body = request.body;

    const checks = [];

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
