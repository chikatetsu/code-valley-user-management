import { UserResponseDTO } from "@application/user/dto";
import { User } from "@domain/user/entities/user.entity";


export interface IJwtService {
    validate(payload: any): Promise<UserResponseDTO>;
}