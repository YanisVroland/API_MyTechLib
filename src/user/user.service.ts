import { HttpException, Injectable } from '@nestjs/common';
import { CustomResponse } from '../utils/CustomResponse';
import { Constants } from '../utils/Constants';
import { createClient } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Injectable()
export class UserService {
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async auth(email: string, password: string) {
    const { data: authData, error: error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, error.status);
    }

    const user = await this.getUser(authData.session.user.id);

    return {
      name: user.name,
      lastname: user.lastname,
      created_at: user.created_at,

      uuidUser: authData.session.user.id,
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    };
  }

  async getUser(uuidUser: string) {
    const { data: userData, error: error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('uuid', uuidUser);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    const user = userData[0];
    return {
      uuidUser: user.uuid,
      name: user.name,
      lastname: user.lastname,
      created_at: user.created_at,
    };
  }

  async registration(body: any): Promise<CustomResponse> {
    const idUser = await this.createUserAuth(body);

    const newUser = {
      uuid: idUser.user.id,
      name: body.name,
      lastName: body.lastname,
    };

    const { data, error, status, statusText } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .insert(newUser)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(statusText, status);
    }

    return data[0];
  }

  async createUserAuth(body: any) {
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

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return newUserData;
  }
}
