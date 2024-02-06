import { Injectable } from '@nestjs/common';
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
    const user: any = await this.getOne(Constants.CORE_USER_TABLE_NAME, {
      uuid: data.user.id,
    });

    this.dbLogger.log('PING');
    return {
      name: user.name,
      surname: user.surname,
      lastname: user.lastname,
      core_company: user.core_company,
      access_token: token,
    };
  }

  async getOne(
    tableName: string,
    whereClauses: any = {},
    foreignTables: any[] = [],
  ): Promise<any> {
    let selectString = '*';
    for (const foreignTable of foreignTables) {
      selectString += `, ${foreignTable} (*)`;
    }

    const { data, error } = await this.supabase
      .getClient()
      .from(tableName)
      .select(selectString)
      .match(whereClauses)
      .limit(1);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw Utils.convertSupabaseErrorToHttpError(
        error.code,
        `Failed to fetch data from '${tableName}' with where clauses '${JSON.stringify(
          whereClauses,
        )}'`,
      );
    }
    this.dbLogger.log(
      `SELECT one
             FROM ${tableName}
             WHERE ${JSON.stringify(whereClauses)}`,
    );
    return data[0];
  }
}
