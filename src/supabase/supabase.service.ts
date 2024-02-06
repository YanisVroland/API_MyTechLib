import { HttpException, Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Supabase } from './supabase';
import { DatabaseLogger } from './supabase.logger';
import { Utils } from '../utils';
import { CustomResponse } from '../utils/CustomResponse';
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
    const user: any = await this.getOne('core_user', {
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

  async create(tableName: string, body: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(tableName)
      .insert(body)
      .select()
      .limit(1);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw Utils.convertSupabaseErrorToHttpError(
        error.code,
        `Failed to add data into '${tableName}'`,
      );
    }

    this.dbLogger.log(
      `CREATE TABLE ${tableName} with body ${JSON.stringify(body)}`,
    );

    return data[0] || null;
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

  async auth(email: string, password: string): Promise<CustomResponse> {
    const { data: authData, error: authError } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (authError) {
      throw new HttpException(authError.message, authError.status);
    }

    const user: any = await this.getOne(Constants.CORE_USER_TABLE_NAME, {
      uuid: authData.user.id,
    });

    this.dbLogger.log('user connected');
    return new CustomResponse(200, '', {
      name: user.name,
      lastname: user.lastname,
      core_company: user.core_company,
      access_token: authData.session.access_token,
    });
  }

  async registration(body: any): Promise<CustomResponse> {
    const supabaseAdminClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data: newUserData, error } =
      await supabaseAdminClient.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
      });
    if (error) return new CustomResponse(500, error.toString(), {});
    const newUser = await this.create(Constants.CORE_USER_TABLE_NAME, {
      uuid: newUserData.user.id,
      name: body.name,
      lastname: body.lastname,
    });
    return new CustomResponse(201, '', newUser);
  }
}
