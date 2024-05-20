import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(BlacklistedToken)
    private blacklistRepository: Repository<BlacklistedToken>,
  ) {}

  async addTokenToBlacklist(token: string): Promise<void> {
    const blacklistedToken = new BlacklistedToken();
    blacklistedToken.token = token;
    await this.blacklistRepository.save(blacklistedToken);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistRepository.findOne({ where: { token } });
    return !!blacklistedToken;
  }
}
