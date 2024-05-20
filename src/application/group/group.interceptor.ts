import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@domain/user/entities/user.entity';
import { Group } from '@domain/group/entities/group.entity';

@Injectable()
export class GroupInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const body = request.body;

    const checks = [
      { id: params.groupId, repository: this.groupRepository, message: 'Group not found' },
      { id: params.userId, repository: this.userRepository, message: 'User not found' },
      { id: body.userId, repository: this.userRepository, message: 'User not found' }
    ];

    const checkPromises = checks
      .filter(check => check.id !== undefined && check.id !== null)
      .map(check => check.repository.findOne({ where: { id: check.id } })
        .then(entity => {
          if (!entity) {
            throw new NotFoundException(check.message);
          }
        })
      );

    return from(Promise.all(checkPromises)).pipe(
      switchMap(() => next.handle())
    );
  }
}
