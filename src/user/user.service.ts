import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { createClient } from '@supabase/supabase-js';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UserService {
  // Define the user table name using the Constants enum
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
  ) {}

  /**
   * Method to retrieve user information by UUID.
   * @param uuidUser The UUID of the user.
   * @returns The user object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async getUser(uuidUser: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('uuid', uuidUser);

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    // Throw error if no data is found for the given UUID
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  /**
   * Method to authenticate user with email and password.
   * @param email The user's email.
   * @param password The user's password.
   * @returns Object containing user UUID, access token, and refresh token.
   * @throws HttpException if an error occurs.
   */
  async auth(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: email,
        password: password,
      });

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, error.status);
    }

    return {
      uuid_user: data.session.user.id,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  /**
   * Method to register a new user.
   * @param body The data for user registration.
   * @returns The newly registered user object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async registration(body: any) {
    // Create user authentication
    const idUser = await this.createUserAuth(body);

    // Create user data
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

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(statusText, status);
    }
    // Throw error if no data is found after insertion
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  /**
   * Method to send password reset email.
   * @param body Object containing email address for password reset.
   * @returns Object confirming email has been sent.
   * @throws HttpException if an error occurs.
   */
  async sendPasswordResetEmail(body: any) {
    const { error } = await this.supabase
      .getClient()
      .auth.resetPasswordForEmail(body.email);

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return { message: 'Email sent' };
  }

  /**
   * Method to create user authentication.
   * @param body The data for user authentication.
   * @returns The newly created user authentication data.
   * @throws HttpException if an error occurs.
   */
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

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return data;
  }

  /**
   * Method to remove user from company.
   * @param uuidUser The UUID of the user to remove from company.
   * @returns Object confirming user has left the company.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async leaveCompany(uuidUser: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update({ core_company: null, company_admin: false })
      .eq('uuid', uuidUser)
      .select();

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    // Throw error if no data is found for the given UUID
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return { message: 'User left the company' };
  }

  /**
   * Method to set company admin status for users.
   * @param body Object containing list of user UUIDs.
   * @param boolean The value to set for company admin status.
   * @returns Object confirming users' admin status has been updated.
   * @throws HttpException if an error occurs.
   */
  async setCompanyAdmin(body: any, boolean: boolean) {
    const listUuid = body.listUuid;

    for (let i = 0; i < listUuid.length; i++) {
      const { error } = await this.supabase
        .getClient()
        .from(this.userTableName)
        .update({ company_admin: boolean })
        .eq('uuid', listUuid[i])
        .select();

      // Handle error if any
      if (error) {
        this.dbLogger.error(JSON.stringify(error));
        throw new HttpException(error.message, 500);
      }
    }

    return { message: 'Users add admin' };
  }

  /**
   * Method to update user information by UUID.
   * @param uuidUser The UUID of the user to update.
   * @param body The data to update for the user.
   * @returns The updated user object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async updateUser(uuidUser: string, body: any) {
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update(body)
      .eq('uuid', uuidUser)
      .select();

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    // Throw error if no data is found for the given UUID
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  /**
   * Method to upload user profile image.
   * @param file The image file to upload.
   * @param uuidUser The UUID of the user.
   * @returns The updated user object with profile image URL.
   * @throws HttpException if an error occurs.
   */
  async uploadImageProfile(file: any, uuidUser: string) {
    // Check if file exists
    if (!file) throw new HttpException('File not found', 400);

    // Upload file to Firebase storage
    const url = await this.storageFirebase.uploadFile(
      file,
      'user/' + uuidUser + '/logo',
    );

    // Handle error if file upload fails
    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    // Update user profile URL in the database
    return this.updateUser(uuidUser, { profile_url: url });
  }
}
