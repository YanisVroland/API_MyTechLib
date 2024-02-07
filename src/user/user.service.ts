import { HttpException, Injectable } from '@nestjs/common';
import { CustomResponse } from '../utils/CustomResponse';
import { Constants } from '../utils/Constants';
import { createClient } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';

@Injectable()
export class UserService {
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(private readonly supabase: Supabase) {}

  // Authentifier un utilisateur
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

    return new CustomResponse(200, '', {
      uuidUser: authData.session.user.id,
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });
  }

  async getUser(uuidUser: string) {
    console.log(uuidUser);
    const { data: userData, error: dbError } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('uuid', uuidUser);

    if (dbError) {
      throw new HttpException(dbError.message, 500);
    }

    const user = userData[0];
    return new CustomResponse(200, '', {
      uuidUser: user.uuid,
      name: user.name,
      lastname: user.lastname,
      created_at: user.created_at,
    });
  }

  // Enregistrer un nouvel utilisateur
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
      throw new HttpException(statusText, status);
    }

    return new CustomResponse(201, '', data[0]);
  }

  // Créer un utilisateur avec l'API d'administration de Supabase
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
      throw new HttpException(error.message, 500);
    }

    return newUserData;
  }
}
