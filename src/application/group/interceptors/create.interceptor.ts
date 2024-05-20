import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException, Logger } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@domain/user/entities/user.entity';
import { Group } from '@domain/group/entities/group.entity';

@Injectable()
export class CreateGroupInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const memberIds = body.memberIds;
 
    const userId = request.user.id;

    return from(
      this.groupRepository.createQueryBuilder('group')
        .leftJoin('group.members', 'member')
        .where('member.id = :userId', { userId })
        .orWhere('member.id IN (:...memberIds)', { memberIds })
        .getOne()
    ).pipe(
      switchMap(group => {
        if (group) {
          throw new BadRequestException('User has already created or joined a group');
        }
        return next.handle();
      })
    );
  }
}
