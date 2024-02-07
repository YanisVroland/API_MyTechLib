import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from './supabase';
import { DatabaseLogger } from './supabase.logger';
import { Constants } from '../utils/Constants';

@Injectable()
export class SupabaseService {
  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async ping() {
    const { error: error } = await this.supabase
      .getClient()
      .from(Constants.CORE_USER_TABLE_NAME)
      .select(`*`);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return { message: 'pong' };
  }
}
