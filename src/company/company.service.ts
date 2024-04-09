import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CompanyService {
  private companyTableName = Constants.CORE_COMPANY_TABLE_NAME;
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
  ) {}

  async getCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .select(`*,created_by(name,lastName,uuid)`)
      .eq('uuid', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async getUserCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('core_company', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async createCompany(body: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async uploadLogoCompany(file: any, uuidCompany: string) {
    if (!file) throw new HttpException('File not found', 400);
    const url = await this.storageFirebase.uploadFile(
      file,
      'company/' + uuidCompany + '/logo',
    );

    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    return this.updateCompany(uuidCompany, { logo_url: url });
  }

  async updateCompany(uuidCompany: string, body: any) {
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .update(body)
      .eq('uuid', uuidCompany)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async deleteCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .delete()
      .eq('uuid', uuidCompany)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }
}
