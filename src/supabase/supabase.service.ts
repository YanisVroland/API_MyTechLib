import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from './supabase';
import { DatabaseLogger } from './supabase.logger';
import { Utils } from '../utils';
import { Constants } from '../utils/Constants';

@Injectable()
export class SupabaseService {
  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async ping(token: string) {
    const { data, error } = await this.supabase.getClient().auth.getUser();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw Utils.convertSupabaseErrorToHttpError(
        error.status.toString(),

        `Failed to ping database`,
      );
    }

    const { data: userData, error: dbError } = await this.supabase
      .getClient()
      .from(Constants.CORE_USER_TABLE_NAME)
      .select(`*`)
      .eq('uuid', data.user.id);

    if (dbError) throw new HttpException(dbError.message, 500);

    const user = userData[0];

    this.dbLogger.log('PING');
    return {
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      core_company: user.core_company,
      access_token: token,
    };
  }
}
