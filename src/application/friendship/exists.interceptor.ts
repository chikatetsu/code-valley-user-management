import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@domain/user/entities/user.entity';
import { Friendship } from '@domain/friendship/entities/friendship.entity';

@Injectable()
export class ExistsInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const body = request.body;

    const checks = [
      { id: params.senderId, repository: this.userRepository, message: 'Sender not found' },
      { id: params.receiverId, repository: this.userRepository, message: 'Receiver not found' },
      { id: params.friendshipId, repository: this.friendshipRepository, message: 'Friendship not found' },
      { id: body.userId, repository: this.userRepository, message: 'User not found' },
      { id: body.friendId, repository: this.userRepository, message: 'Friend not found' }
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