import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Injectable()
export class InformationService {
  private informationTableName = Constants.CORE_INFORMATION_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async getInformationByCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.informationTableName)
      .select(`*, created_by(uuid,name,lastName)`)
      .eq('core_company', uuidCompany)
      .order('created_at', { ascending: false });

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async getOneInformation(uuidInformation: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.informationTableName)
      .select(`*`)
      .eq('uuid', uuidInformation);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async createInformation(body: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.informationTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async deleteInformation(uuidInformation: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.informationTableName)
      .delete()
      .eq('uuid', uuidInformation)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }
}
