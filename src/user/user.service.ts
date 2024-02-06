import { HttpException, Injectable } from '@nestjs/common';
import { CustomResponse } from '../utils/CustomResponse';
import { Constants } from '../utils/Constants';
import { createClient } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';

@Injectable()
export class UserService {
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(private readonly supabase: Supabase) {}

  async getOneUser(uuid: string) {
    const { data: dataDb, error: errorDb } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('uuid', uuid);
    if (errorDb) throw new HttpException(errorDb.message, 500);
    return dataDb[0];
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

    const user: any = await this.getOneUser(authData.user.id);
    return new CustomResponse(200, '', {
      name: user.name,
      lastname: user.lastname,
      core_company: user.core_company,
      access_token: authData.session.access_token,
    });
  }

  async registration(body: any): Promise<CustomResponse> {
    const idUser = await this.createUserAuth(body);

    const newUser = {
      uuid: idUser,
      name: body.name,
      lastName: body.lastname,
    };

    console.log(newUser);

    const { data, error, status, statusText } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .insert(newUser)
      .select();

    console.log(data);
    console.log(error);

    if (error) throw new HttpException(statusText, status);
    return new CustomResponse(201, '', data[0]);
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

    if (error) return new CustomResponse(500, error.toString(), {});

    return newUserData.user.id;
  }
}
