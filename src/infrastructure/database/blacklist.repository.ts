import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { BlacklistedToken } from '@domain/auth/entities/blacklisted-token.entity';

@Injectable()
export class BlackListRepository extends Repository<BlacklistedToken> {
  constructor(private dataSource: DataSource) {
    super(BlacklistedToken, dataSource.createEntityManager());
  }
}
