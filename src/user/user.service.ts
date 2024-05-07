import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { createClient } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UserService {
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
  ) {}

  async getUser(uuidUser: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('uuid', uuidUser);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async auth(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, error.status);
    }
    // const user = await this.getUser(data.session.user.id);

    return {
      uuid_user: data.session.user.id,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  async registration(body: any) {
    const idUser = await this.createUserAuth(body);
    const newUser = {
      uuid: idUser.user.id,
      name: body.name,
      lastName: body.lastname,
      email: body.email,
    };

    const { data, error, status, statusText } = await this.supabase
      .getClient(false)
      .from(this.userTableName)
      .insert(newUser)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(statusText, status);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async sendPasswordResetEmail(body: any) {
    const { error } = await this.supabase
      .getClient()
      .auth.resetPasswordForEmail(body.email);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return { message: 'Email sent' };
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

    const { data, error } = await supabaseAdminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    });

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return data;
  }

  async leaveCompany(uuidUser: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update({ core_company: null, company_admin: false })
      .eq('uuid', uuidUser)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return { message: 'User left the company' };
  }

  async setCompanyAdmin(uuidUser: string, boolean: boolean) {
    console.log(uuidUser, boolean);
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update({ company_admin: boolean })
      .eq('uuid', uuidUser)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return { message: 'User add admin' };
  }

  async updateUser(uuidUser: string, body: any) {
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update(body)
      .eq('uuid', uuidUser)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async uploadImageProfile(file: any, uuidUser: string) {
    if (!file) throw new HttpException('File not found', 400);
    const url = await this.storageFirebase.uploadFile(
      file,
      'user/' + uuidUser + '/logo',
    );

    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    return this.updateUser(uuidUser, { profile_url: url });
  }
}
