import { User } from "src/domain/user/entities/user.entity";

export interface IJwtService {
    validate(payload: any): Promise<User>;
}