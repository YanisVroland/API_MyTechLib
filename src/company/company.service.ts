import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Injectable()
export class CompanyService {
  private companyTableName = Constants.CORE_COMPANY_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async getCompany(uuidCompany: string) {
    const { data: companyData, error: error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .select(`*`)
      .eq('uuid', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (companyData.length === 0)
      throw new HttpException('Resource not found', 404);

    return companyData[0];
  }

  async getCompanyByUser(uuidUser: string) {
    const { data: companyData, error: error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .select(`*`)
      .eq('uuid_user', uuidUser);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (companyData.length === 0)
      throw new HttpException('Resource not found', 404);

    return companyData[0];
  }

  async getAllCompanies() {
    const { data: companyData, error: error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .select(`*`);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    return companyData;
  }

  async createCompany(body: any) {
    const { data: companyData, error: error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .insert([body]);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (companyData.length === 0)
      throw new HttpException('Resource not found', 404);

    return companyData[0];
  }

  async updateCompany(uuidCompany: string, body: any) {
    const { data: companyData, error: error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .update(body)
      .eq('uuid', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (companyData.length === 0)
      throw new HttpException('Resource not found', 404);

    return companyData[0];
  }

  async deleteCompany(uuidCompany: string) {
    const { data: companyData, error: error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .delete()
      .eq('uuid', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    if (companyData.length === 0)
      throw new HttpException('Resource not found', 404);

    return companyData[0];
  }
}
