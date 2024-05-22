import { User } from '@domain/user/entities/user.entity';

export interface IJwtService {
  validate(req: any, payload: any, done: Function): Promise<User>;
}
